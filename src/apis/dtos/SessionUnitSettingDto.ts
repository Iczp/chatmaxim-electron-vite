import { SessionUnitSettingSimpleDto } from './SessionUnitSettingSimpleDto';

export type SessionUnitSettingDto = SessionUnitSettingSimpleDto & {
  /**
   * 已读消息记录
   *
   * @type {(number | null)}
   */
  readedMessageId?: number | null;

  /**
   * 备注名称
   *
   * @type {(string | null)}
   */
  rename?: string | null;

  /**
   * 备注
   */
  remarks?: string | null;

  /**
   * 是否保存通讯录(群)
   */
  isContacts?: boolean | null;

  /**
   * 消息免打扰，默认为 false
   */
  isImmersed?: boolean | null;

  /**
   * 是否显示成员名称
   */
  isShowMemberName?: boolean | null;

  /**
   * 是否显示已读
   */
  isShowReaded?: boolean | null;

  /**
   * 聊天背景，默认为 null
   */
  backgroundImage?: string | null;

  
};
