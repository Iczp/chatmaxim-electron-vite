export type TokenDto = {
  readonly access_token: string;

  readonly token_type: string;

  /** 过期时间，单位：秒 */
  readonly expires_in: number;

  readonly refresh_token: string;

  /** 可选字段（OpenIddict 可能返回） */
  readonly scope?: string;
  readonly id_token?: string;

  /** 获取时间（本地字段） */
  creation_time?: Date;

  /** 绝对过期时间戳 ms（本地字段，避免反复换算） */
  expires_at?: number;
};
