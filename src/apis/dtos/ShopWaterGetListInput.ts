import { GetListInput } from './GetListInput';

export type ShopWaterGetListInput = GetListInput & {
  /**
   * 是否包含店主
   *
   * @type {boolean}
   */
  isContainsShopKeeper?: boolean;
  /**
   * 掌柜Id[聊天对象]
   */
  shopKeeperId?: number;
};
