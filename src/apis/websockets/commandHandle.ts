import { useImStore } from '../../stores/im';
import { useUserStore } from '../../stores/user';
import { SessionUnitService } from '../services/SessionUnitService';
import { ReceivedDto } from './ReceivedDto';
import * as CommandConsts from './commandConsts';
const data = {
  appUserId: '360cfedb-e92d-3331-1fad-3a086371e0e4',
  scopes: [
    { chatObjectId: 13, sessionUnitId: 'e52bacf4-c231-061a-6628-3a0b0cf571fb' },
    { chatObjectId: 14, sessionUnitId: '9207e993-62b6-52e3-6f8c-3a0b0cf571fb' },
  ],
  command: 'Chat',
  payload: {
    content: { text: '13+12', id: '8234ef0a-ddde-e7f8-d927-3a0f2bc7ce7e' },
    id: 7238644,
    senderName: '林惠娟',
    messageType: 0,
    reminderType: null,
    isPrivate: false,
    isRollbacked: false,
    rollbackTime: null,
    creationTime: '2023-11-29T13:43:55.3106486+08:00',
  },
};
export const commandHandle = ({ appUserId, scopes, command, payload }: ReceivedDto) => {
  console.log(`commandHandle`, command);
  console.log('scopes', scopes);
  const store = useImStore();
  const idList = scopes.map(x => x.sessionUnitId);
  switch (command) {
    case CommandConsts.Chat:
      break;
    case CommandConsts.IncrementCompleted:

    

      store.fetchMany(idList);
      const userStore = useUserStore();
      userStore.getBadgeByCurrentUser();
      break;
    case CommandConsts.SessionRequest:
      break;
    case CommandConsts.Rollback:
      
      break;
    default:
      break;
  }
};

export const handleIncrementCompleted = ()=>{

}