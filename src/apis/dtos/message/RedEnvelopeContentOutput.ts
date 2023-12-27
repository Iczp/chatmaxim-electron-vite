import { GrantModeEnums } from '../../enums/GrantModeEnums';

export type RedEnvelopeContentOutput = {
  id?: string | null;
  /**
   * 文本内容
   */
  text?: string | null;
  /**
   * 创建人(发红包的人)
   */
  readonly ownerId?: number | null;
  /**
   * 红包发放方式（0：随机金额;1:固定金额）
   */
  grantMode?: GrantModeEnums;
  /**
   * 金额
   */
  amount?: number;
  /**
   * 数量
   */
  count?: number;
  /**
   * 总金额
   */
  totalAmount?: number;
  /**
   * 到期时间
   */
  readonly expireTime?: string | null;
};
