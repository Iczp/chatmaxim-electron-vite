import { GrantModeEnums } from '../../enums/GrantModeEnums';

export type RedEnvelopeContentInput = {
  id?: string | null;
  password?: string | null;
  /**
   * 红包发放方式（0：随机金额;1:固定金额）
   */
  grantMode?: GrantModeEnums;
  /**
   * 单个金额Red Envelope
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
   * 文本内容
   */
  text?: string | null;
};

