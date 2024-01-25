import { GenderEnums, VerificationMethodEnums } from '../enums';

export type ChatObjectUpdateInput = {
  /**
   * 父级Id,为null时，根级
   */
  parentId?: number | null;
  /**
   * 名称
   */
  name?: string | null;
  /**
   * 排序(越大越前)
   */
  sorting?: number;

  /**
   *
   *
   * @type {(string | null)}
   */
  code?: string | null;
  /**
   * 性别
   */
  gender?: GenderEnums;

  /**
   *
   *
   * @type {VerificationMethodEnums}
   */
  verificationMethod?: VerificationMethodEnums;
  /**
   *
   *
   * @type {(string | null)}
   */
  description?: string | null;
};
