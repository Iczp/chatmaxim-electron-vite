export enum ConnectionState {
  /**
   * 未连接
   */
  None = 0,

  /**
   * 连接成功
   */
  Ok = 1,

  /**
   *
   */
  Connecting = 2,

  /**
   * 连接错误
   */
  Error = 3,

  /**
   * 连接关闭
   */
  Close = 4,

  /**
   * 登录中
   */
  Signing = 5,

  /**
   * 登录成功
   */
  SignOk = 6,

  /**
   * 登录失败
   */
  SignFail = 7,
}

export const ConnectionStateText: { [key in ConnectionState]: string } = {
  [ConnectionState.None]: '未连接',
  [ConnectionState.Ok]: '连接成功',
  [ConnectionState.Connecting]: '连接中',
  [ConnectionState.Error]: '连接错误',
  [ConnectionState.Close]: '连接关闭',
  [ConnectionState.Signing]: '登录中',
  [ConnectionState.SignOk]: '登录成功',
  [ConnectionState.SignFail]: '登录失败',
};
