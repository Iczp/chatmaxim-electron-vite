import { message } from 'ant-design-vue';
import { FavoriteService } from '../apis';
export const setFavorite = async ({
  sessionUnitId,
  messageId,
  isFavorite,
  deviceId,
}: {
  /**
   * 会话单元Id
   */
  sessionUnitId: string;
  /**
   * 消息Id
   */
  messageId: number;

  /**
   * 是否收藏
   */
  isFavorite: boolean;

  /**
   * 设备Id
   */
  deviceId?: string;
}): Promise<boolean> => {
  const key = 'setFavorite';
  message.loading({ content: 'loading', key });
  const res = await FavoriteService.setFavorite({
    sessionUnitId,
    messageId,
    deviceId,
    isFavorite,
  });
  message.success({ content: !isFavorite ? '取消收藏' : '收藏', duration: 2, key });

  return res;
};

