import { message } from 'ant-design-vue';
import { FavoriteService, MessageSenderService } from '../apis';
import { objectPicker } from '../ipc/objectPicker';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

/**
 * 收藏与取消
 */
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
  message.success({ content: !isFavorite ? '取消收藏' : '收藏成功', duration: 2, key });

  return res;
};
/**
 * 转发消息
 *
 */
export const forwardMessage = ({
  t,
  messageId,
  chatObjectId,
  sessionUnitId,
}: {
  /**
   * i18n
   *
   * @type {*}
   */
  t: any;
  /**
   * 对象Id
   *
   * @type {number}
   */
  chatObjectId: number;

  /**
   *
   * 会话单元Id
   * @type {string}
   */
  sessionUnitId: string;

  /**
   * 消息Id
   *
   * @type {number}
   */
  messageId: number;
}) => {
  const key = new Date().toString();
  objectPicker({
    t,
    payload: {
      title: t('Forward'),
      confirmText: t('Confirm Forward'),
      chatObjectId,
      isMultiple: true,
      isInputEnabled: true,
      selectedItems: [],
      disabledItems: [{ id: sessionUnitId }],
    },
  })
    .then(v => {
      console.log('forward', v);

      // const { t } = useI18n();

      message.loading({ content: t('Message forwarding'), key });

      MessageSenderService.postApiChatMessageSenderForward({
        sessionUnitId,
        messageId,
        requestBody: v.selectedItems?.map(x => x.id!.toString()) || [],
      })
        .then(res => {
          message.success({ content: t('Message forwarding successful'), key });
        })
        .catch(err => {
          console.error('MessageSenderService.postApiChatMessageSenderForward', err);
          message.error({ content: err.body?.error?.message || 'Api Error', key });
        });
    })
    .catch(err => {
      console.error('objectPicker', err);
      // message.error({ content: '转发失败', key });
    });
};

/**
 * 撤回消息
 *
 */
export const rollbackMessage = ({
  t,
  messageId,
}: {
  t: any;
  /**
   * 消息Id
   *
   * @type {number}
   */
  messageId: number;
}): Promise<boolean> =>
  new Promise((resolve, reject) => {
    // const { t } = useI18n();
    Modal.confirm({
      title: t('Rollback message'),
      content: `${t('Roback confirm content')}`,
      icon: createVNode(ExclamationCircleOutlined),
      cancelText: t('Cancel'),
      okText: t('Confirm rollback'),
      maskClosable: true,
      wrapClassName: 'chat-models',
      onOk() {
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));

        const key = new Date().toString();
        MessageSenderService.postApiChatMessageSenderRollback({
          messageId,
        })
          .then(res => {
            message.success({ content: t('Rollback succeed'), key });
            resolve(true);
          })
          .catch(err => {
            console.error('MessageSenderService.postApiChatMessageSenderRollback', err);
            message.error({ content: err.body?.error?.message || 'Api Error', key });
            reject(false);
          });
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  });
