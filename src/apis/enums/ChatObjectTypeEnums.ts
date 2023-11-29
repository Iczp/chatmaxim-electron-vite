/**
 * 聊天对象类型
 *
 * @export
 * @enum {number}
 */
export enum ChatObjectTypeEnums {
  /**
   * 匿名
   */
  'Anonymous' = 0,
  /**
   * 个人
   */
  'Personal' = 1,
  /**
   * 群
   */
  'Room' = 2,
  /**
   * 服务号
   */
  'Official' = 3,
  /**
   * 订阅号
   */
  'Subscription' = 4,
  /**
   * 广场
   */
  'Square' = 5,
  /**
   * 机器人
   */
  'Robot' = 6,
  /**
   * 掌柜
   */
  'ShopKeeper' = 7,
  /**
   * 店小二
   */
  'ShopWaiter' = 8,
  /**
   * 客户
   */
  'Customer' = 9,
}


export const ChatObjectTypeEnumText: { [key in ChatObjectTypeEnums]?: string } = {
  [ChatObjectTypeEnums.Anonymous]: '匿名',
  [ChatObjectTypeEnums.Personal]: '个人',
  [ChatObjectTypeEnums.Room]: '群',
  [ChatObjectTypeEnums.Official]: '服务号',
  [ChatObjectTypeEnums.Subscription]: '订阅号',
  [ChatObjectTypeEnums.Square]: '广场',
  [ChatObjectTypeEnums.Robot]: '机器人',
  [ChatObjectTypeEnums.ShopKeeper]: '掌柜',
  [ChatObjectTypeEnums.ShopWaiter]: '店小二',
  [ChatObjectTypeEnums.Customer]: '客户',

};