// 全局类型声明
declare global {
  // 示例：全局Window扩展
  interface Window {
    __MY_APP__: {
      version: string;
      env: 'development' | 'production';
    };
  }

  // 示例：全局工具类型
  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
}