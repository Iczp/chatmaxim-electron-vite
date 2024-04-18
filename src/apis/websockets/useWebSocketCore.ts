// import type { Ref } from 'vue-demi'
// import { ref } from 'vue-demi'
import type { Fn, MaybeRefOrGetter } from '@vueuse/shared';
import { Ref, ref, toRef } from 'vue';
import { isClient, isWorker, tryOnScopeDispose, useIntervalFn } from '@vueuse/shared';
import { useEventListener } from '@vueuse/core';
// import { useEventListener } from '../useEventListener'

export type WebSocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSED';

export type MsgType = string | ArrayBuffer | Blob;
export type MsgFn = () => MsgType;
const DEFAULT_PING_MESSAGE = (): MsgType => `ping ${new Date().getTime()}`;

export interface UseWebSocketOptions {
  // url: any; //string | URL | (() => string | URL) | Promise<string | URL>;
  onReady: (retried: number) => Promise<string | URL | undefined>;
  onConnected?: (ws: WebSocket) => void;
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void;
  onError?: (ws: WebSocket, event: Event) => void;
  onMessage?: (ws: WebSocket, event: MessageEvent) => void;
  onPing?: (content: string) => void;

  /**
   * Send heartbeat for every x milliseconds passed
   *
   * @default false
   */
  heartbeat?:
    | boolean
    | {
        /**
         * Message for the heartbeat
         *
         * @default 'ping'
         */
        message?: MsgType | MsgFn;

        /**
         * Interval, in milliseconds
         *
         * @default 1000
         */
        interval?: number;

        /**
         * Heartbeat response timeout, in milliseconds
         *
         * @default 1000
         */
        pongTimeout?: number;
      };

  /**
   * Enabled auto reconnect
   *
   * @default false
   */
  autoReconnect?:
    | boolean
    | {
        /**
         * Maximum retry times.
         *
         * Or you can pass a predicate function (which returns true if you want to retry).
         *
         * @default -1
         */
        retries?: number | (() => boolean);

        /**
         * Delay for reconnect, in milliseconds
         *
         * @default 1000
         */
        delay?: number;

        /**
         * On maximum retry times reached.
         */
        onFailed?: Fn;
      };

  /**
   * Automatically open a connection
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Automatically close a connection
   *
   * @default true
   */
  autoClose?: boolean;

  /**
   * List of one or more sub-protocol strings
   *
   * @default []
   */
  protocols?: string[];
}

export interface UseWebSocketReturn<T> {
  /**
   * Reference to the latest data received via the websocket,
   * can be watched to respond to incoming messages
   */
  data: Ref<T | null>;

  /**
   * The current websocket status, can be only one of:
   * 'OPEN', 'CONNECTING', 'CLOSED'
   */
  status: Ref<WebSocketStatus>;

  /**
   * Closes the websocket connection gracefully.
   */
  close: WebSocket['close'];

  /**
   * Reopen the websocket connection.
   * If there the current one is active, will close it before opening a new one.
   */
  open: Fn;

  /**
   * Sends data through the websocket connection.
   *
   * @param data
   * @param useBuffer when the socket is not yet open, store the data into the buffer and sent them one connected. Default to true.
   */
  send: (data: MsgType, useBuffer?: boolean) => boolean;

  /**
   * Reference to the WebSocket instance.
   */
  ws: Ref<WebSocket | undefined>;
}

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true) return {} as T;
  return options;
}

/**
 * Reactive WebSocket client.
 *
 * @see https://vueuse.org/useWebSocket
 * @param url
 */
export function useWebSocketCore<Data = any>(
  options: UseWebSocketOptions,
): UseWebSocketReturn<Data> {
  const {
    onReady,
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    immediate = true,
    autoClose = true,
    protocols = [],
  } = options;

  const data: Ref<Data | null> = ref(null);
  const status = ref<WebSocketStatus>('CLOSED');
  const wsRef = ref<WebSocket | undefined>();
  const urlRef = ref<string>();

  let heartbeatPause: Fn | undefined;
  let heartbeatResume: Fn | undefined;

  let explicitlyClosed = false;
  let retried = 0;

  let bufferedData: MsgType[] = [];

  let pongTimeoutWait: ReturnType<typeof setTimeout> | undefined;

  const _sendBuffer = () => {
    if (bufferedData.length && wsRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData) wsRef.value.send(buffer);
      bufferedData = [];
    }
  };

  const resetHeartbeat = () => {
    clearTimeout(pongTimeoutWait);
    pongTimeoutWait = undefined;
  };

  // Status code 1000 -> Normal Closure https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  const close: WebSocket['close'] = (code = 1000, reason) => {
    if (!isClient || !wsRef.value) return;
    explicitlyClosed = true;
    resetHeartbeat();
    heartbeatPause?.();
    wsRef.value.close(code, reason);
    wsRef.value = undefined;
  };

  const send = (data: MsgType, useBuffer = true) => {
    if (!wsRef.value || status.value !== 'OPEN') {
      if (useBuffer) bufferedData.push(data);
      return false;
    }
    _sendBuffer();
    wsRef.value.send(data);
    return true;
  };

  let retryTimer: NodeJS.Timeout | undefined;

  const clearRetryTimer = () => {
    if (retryTimer) {
      clearTimeout(retryTimer);
    }
  };
  const _retry = () => {
    clearRetryTimer();
    if (!explicitlyClosed && options.autoReconnect) {
      const { retries = -1, delay = 1000, onFailed } = resolveNestedOptions(options.autoReconnect);
      retried += 1;
      if (typeof retries === 'number' && (retries < 0 || retried < retries)) {
        retryTimer = setTimeout(_init, delay);
      } else if (typeof retries === 'function' && retries()) {
        retryTimer = setTimeout(_init, delay);
      } else onFailed?.();
    }
  };

  const _init = async () => {
    if (explicitlyClosed) {
      console.warn('explicitlyClosed', explicitlyClosed);
      return;
    }

    const url = await onReady(retried);

    if (typeof url === 'undefined') {
      console.warn('url undefined', url);
      _retry();
      return;
    }
    console.warn('connect url', url);
    const ws = new WebSocket(url, protocols);
    wsRef.value = ws;
    status.value = 'CONNECTING';

    ws.onopen = () => {
      status.value = 'OPEN';
      onConnected?.(ws!);
      heartbeatResume?.();
      _sendBuffer();
    };

    ws.onclose = ev => {
      status.value = 'CLOSED';
      onDisconnected?.(ws, ev);
      _retry();
    };

    ws.onerror = e => {
      onError?.(ws!, e);
    };

    ws.onmessage = (e: MessageEvent) => {
      if (options.heartbeat) {
        resetHeartbeat();
        // const { message = DEFAULT_PING_MESSAGE } = resolveNestedOptions(options.heartbeat);
        // if (e.data === message) return;
      }
      data.value = e.data;
      onMessage?.(ws!, e);
    };
  };

  if (options.heartbeat) {
    const {
      message = DEFAULT_PING_MESSAGE,
      interval = 1000,
      pongTimeout = 1000,
    } = resolveNestedOptions(options.heartbeat);

    const { pause, resume } = useIntervalFn(
      () => {
        const content = typeof message === 'function' ? (message as MsgFn)() : message;

        send(content, false);
        options.onPing?.(content as string);
        if (pongTimeoutWait != null) return;
        pongTimeoutWait = setTimeout(() => {
          // auto-reconnect will be trigger with ws.onclose()
          close();
          explicitlyClosed = false;
        }, pongTimeout);
      },
      interval,
      { immediate: false },
    );

    heartbeatPause = pause;
    heartbeatResume = resume;
  }

  if (autoClose) {
    if (isClient) useEventListener('beforeunload', () => close());
    tryOnScopeDispose(close);
  }

  const open = () => {
    clearRetryTimer();
    if (!isClient && !isWorker) return;
    close();
    explicitlyClosed = false;
    retried = 0;
    _init();
  };

  if (immediate) open();

  return {
    data,
    status,
    close,
    send,
    open,
    ws: wsRef,
  };
}
