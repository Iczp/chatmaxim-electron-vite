/**
 * 分享链接消息
 */
export type LinkContentDto = {
    id?: string | null;
    /**
     * Url
     */
    url?: string | null;
    /**
     * 显示名称
     */
    title?: string | null;
    /**
     * 简要说明
     */
    description?: string | null;
    /**
     * 图片
     */
    image?: string | null;
    /**
     * 发行人名称
     */
    issuerName?: string | null;
    /**
     * 发行人图标
     */
    issuerIcon?: string | null;
};
