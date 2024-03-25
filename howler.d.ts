declare module 'howler' {
    interface HowlerCodecs {
        [codec: string]: boolean;
    }

    interface HowlerObject {
        _counter: number;
        _html5AudioPool: any[]; // 这里可以是特定类型的数组，比如 Audio 或者 HTMLAudioElement
        html5PoolSize: number;
        _codecs: HowlerCodecs;
        _howls: any[]; // 同样可以是特定类型的数组，比如 Howl
        _muted: boolean;
        _volume: number;
        _canPlayEvent: string;
        _navigator: any; // 这里应该是 Navigator 或者具有 Navigator 属性的对象
        masterGain: any; // 这里可以是特定类型，比如 GainNode
        noAudio: boolean;
        usingWebAudio: boolean;
        autoSuspend: boolean;
        ctx: any; // 这里可以是特定类型，比如 AudioContext
        autoUnlock: boolean;
        state: string; // 可能是枚举值，比如 "suspended"、"running" 等
        // 可以根据需要添加更多属性
    }

    const Howler: HowlerObject;

    export default Howler;
}