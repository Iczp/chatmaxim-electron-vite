import { message } from 'ant-design-vue';
import { objectPicker } from '../ipc/objectPicker';
import { ChatObjectTypeEnums } from '../apis/enums';
import { RoomService, SessionUnitService } from '../apis';
import { ContactsDto } from '../apis/dtos';
import { navToChat } from './utils';

export const createRoom = ({
  t,
  chatObjectId,
  title,
}: {
  t: any;
  chatObjectId: number;
  title?: string;
}) => {
  const key = new Date().toString();
  objectPicker({
    t,
    payload: {
      title: t('CreateRoom'),
      confirmText: t('CreateRoom'),
      chatObjectId,
      objectTypes: [
        ChatObjectTypeEnums.Personal,
        ChatObjectTypeEnums.Customer,
        ChatObjectTypeEnums.Robot,
        ChatObjectTypeEnums.ShopKeeper,
        ChatObjectTypeEnums.ShopWaiter,
      ],
      isMultiple: true,
      selectedItems: [],
      disabledItems: [],
      minCount: 2,
      maxCount: 100,
    },
  })
    .then(v => {
      console.log('forward', v);

      // const { t } = useI18n();
      const { selectedItems } = v;
      const chatObjectIdList = (selectedItems as ContactsDto[]).map(x => x.destination!.id!);
      console.log('chatObjectIdList', chatObjectIdList);
      const name = `Chat-${chatObjectId}(${chatObjectIdList.length})`;
      message.loading({ content: t('RoomCreating', [name]), key });
      // return;
      RoomService.postApiChatCreateRoom({
        name,
        ownerId: chatObjectId,
        chatObjectIdList,
      })
        .then(chatObject => {
          message.success({ content: t('CreateSuccessful'), key });

          SessionUnitService.getApiChatSessionUnitFindId({
            ownerId: chatObjectId,
            destinactionId: chatObject.id!,
          })
            .then(sessionUnitId => {
              navToChat({ chatObjectId, sessionUnitId, title: chatObject.name });
            })
            .catch(err => {
              console.error('MessageSenderService.postApiChatMessageSenderForward', err);
              message.warn({ content: t('NavigateToChatFail', [name]), key, duration: 3 });
            });

          // navToChat({chatObjectId})
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
