/**
 * 聊天历史
 */
export type HistoryContentInput = {
    id?: string | null;
    /**
     * 消息Id列表
     */
    messageIdList?: Array<number> | null;
};
