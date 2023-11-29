import { reactive, ref, toRaw, toRefs } from 'vue';
import { MessageService } from '../apis';
import { GetListInput, MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { GetList } from './GetList';
import { useFetchList } from './useFetchList';

export class MessageListGetList extends GetList<MessageGetListInput, MessageDto> {
  public maxMessageId?: number;
  constructor(input: MessageGetListInput) {
    super(input);
    super.service = MessageService.getApiChatMessage;
    this.watch(true);
  }

  formatItems(items: MessageDto[]): MessageDto[] {
    const arr = items.map(x => x.id!);
    this.maxMessageId = Math.max(...arr, this.maxMessageId || 0);
    items.forEach(x => {
      x.isSelf = x.senderSessionUnit?.id == this.query?.sessionUnitId;
      x.state = MessageStateEnums.Ok;
    });
    return super.formatItems(items);
  }

  fetchNew() {
    console.log('fetchNew 1', this.query);
    this.query = {
      ...this.query!,
      minMessageId: this.maxMessageId,
      skipCount: 0,
    };
    this.fetchData(this.query);

    console.log('fetchNew', this.query);
  }
}

export const useMessageList1 = (input: MessageGetListInput) => new MessageListGetList(input);

