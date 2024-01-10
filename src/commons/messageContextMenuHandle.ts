import { message } from 'ant-design-vue';
import { FavoriteService, MessageSenderService } from '../apis';
import { objectPicker } from '../ipc/objectPicker';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

/**
 * 收藏与取消
 */
export const setFavorite = async ({
  sessionUnitId,
  messageId,
  isFavorite,
  deviceId,
}: {
  /**
   * 会话单元Id
   */
  sessionUnitId: string;
  /**
   * 消息Id
   */
  messageId: number;

  /**
   * 是否收藏
   */
  isFavorite: boolean;

  /**
   * 设备Id
   */
  deviceId?: string;
}): Promise<boolean> => {
  const key = 'setFavorite';
  message.loading({ content: 'loading', key });
  const res = await FavoriteService.setFavorite({
    sessionUnitId,
    messageId,
    deviceId,
    isFavorite,
  });
  message.success({ content: !isFavorite ? '取消收藏' : '收藏成功', duration: 2, key });

  return res;
};
/**
 * 转发消息
 *
 */
export const forwardMessage = ({
  messageId,
  chatObjectId,
  sessionUnitId,
}: {
  /**
   * 对象Id
   *
   * @type {number}
   */
  chatObjectId: number;

  /**
   *
   * 会话单元Id
   * @type {string}
   */
  sessionUnitId: string;

  /**
   * 消息Id
   *
   * @type {number}
   */
  messageId: number;
}) => {
  const key = new Date().toString();
  objectPicker({
    payload: {
      chatObjectId,
      selectedItems: [],
      disabledItems: [{ id: sessionUnitId }],
    },
  })
    .then(v => {
      console.log('forward', v);

      message.loading({ content: '转发中...', key });

      MessageSenderService.postApiChatMessageSenderForward({
        sessionUnitId,
        messageId,
        requestBody: v.selectedItems?.map(x => x.id!) || [],
      })
        .then(res => {
          message.success({ content: '转发成功!', key });
        })
        .catch(err => {
          console.error('MessageSenderService.postApiChatMessageSenderForward', err);
          message.error({ content: err.body?.error?.message || 'Api Error', key });
        });
    })
    .catch(err => {
      console.error('objectPicker', err);
      // message.error({ content: '转发失败', key });
    });
};

/**
 * 撤回消息
 *
 */
export const rollbackMessage = ({
  messageId,
}: {
  /**
   * 消息Id
   *
   * @type {number}
   */
  messageId: number;
}): Promise<boolean> =>
  new Promise((resolve, reject) => {
    Modal.confirm({
      title: '撤回',
      content: '撤回有局限性，确定要撤回消息?',
      icon: createVNode(ExclamationCircleOutlined),
      cancelText: '取消',
      okText: '确定撤回',
      maskClosable: true,
      wrapClassName: 'chat-models',
      onOk() {
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));

        const key = new Date().toString();
        MessageSenderService.postApiChatMessageSenderRollback({
          messageId,
        })
          .then(res => {
            message.success({ content: '撤回成功!', key });
            resolve(true);
          })
          .catch(err => {
            console.error('MessageSenderService.postApiChatMessageSenderRollback', err);
            message.error({ content: err.body?.error?.message || 'Api Error', key });
            reject(false);
          });
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  });
