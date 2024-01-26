import { GetListInput } from './GetListInput';

export type ShopWaterGetListInput = GetListInput & {
  /**
   * 掌柜Id[聊天对象]
   */
  shopKeeperId?: number;
};
