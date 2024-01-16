
import { ChatObjectDto } from '.';

export type SessionRequestDetailDto = {
    id?: string;
    creationTime?: string;
    /**
     * 发起者Id
     */
    ownerId?: number;
    /**
     * 被请求者Id
     */
    destinationId?: number | null;
    destination?: ChatObjectDto;
    /**
     * 是否处理过
     */
    isHandled?: boolean;
    /**
     * 是否同意
     */
    isAgreed?: boolean | null;
    /**
     * 请求消息
     */
    requestMessage?: string | null;
    /**
     * 是否过期
     */
    isExpired?: boolean;
    /**
     * 过期时间
     */
    expirationTime?: string | null;
    owner?: ChatObjectDto;
    /**
     * 处理消息
     */
    handleMessage?: string ;
    /**
     * 处理时间
     */
    handleTime?: string | null;
};
