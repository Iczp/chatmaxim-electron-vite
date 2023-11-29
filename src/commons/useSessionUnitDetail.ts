//

import { ComputedRef, computed, ref } from 'vue';
import {
  formatMessageTime,
  getDestinationNameForSessionUnit,
  getSenderNameForMessage,
} from './utils';
import { SessionUnitDetailDto, SessionUnitOwnerDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';
import { SessionUnitService } from '../apis';

export const useSessionUnitDetail = ({ sessionUnitId }: { sessionUnitId: string }) => {
  const detail = ref<SessionUnitDetailDto | undefined>();

  SessionUnitService.getApiChatSessionUnitDetail({ id: sessionUnitId })
    .then(res => {
      detail.value = res;
    })
    .catch(err => {
      console.error(err);
    });

  return { detail };
};
