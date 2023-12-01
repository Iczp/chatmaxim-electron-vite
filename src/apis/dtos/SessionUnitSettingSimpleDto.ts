import { JoinWayEnums } from "../enums";

export type SessionUnitSettingSimpleDto = {
    /**
     * 会话内名称
     *
     * @type {(string | null)}
     */
    memberName?: string | null;
  
    /**
     * 加入方式
     *
     * @type {(JoinWayEnums | null)}
     */
    joinWay?: JoinWayEnums | null;
  
    /**
     * 是否公开
     */
    isPublic?: boolean | null;
  
    /**
     * 是否固定成员
     */
    isStatic?: boolean | null;
  
    /**
     * 是否创建人
     */
    isCreator?: boolean | null;
  
    /**
     * 加入方式
     */
    isKilled?: boolean | null;
  
    /**
     * 是否输入
     *
     * @type {boolean| null}
     */
    isInputEnabled?: boolean | null;
  
    /**
     * 是否可用
     *
     * @type {boolean| null}
     */
    isEnabled?: boolean | null;
  
    /**
     * 邀请人
     */
    inviterId?: string | null;
  
    /**
     * 禁言过期时间
     */
    muteExpireTime?: string | null;
  
  };