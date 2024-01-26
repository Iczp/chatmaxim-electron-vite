import { ShopWaiterService } from '../../../apis';
import { ChatObjectDto } from '../../../apis/dtos';
import { ShopWaterGetListInput } from '../../../apis/dtos/ShopWaterGetListInput';
import { useFetchList } from '../../../commons/useFetchList';
import { PickerInput } from '../../../ipc/openChildWindow';

export const useWaitersList = ({
  input,
  picker,
}: {
  input: ShopWaterGetListInput;
  picker?: PickerInput;
}) =>
  useFetchList<ShopWaterGetListInput, ChatObjectDto>({
    service: ShopWaiterService.getApiChatShopWaiterList,
    input,
    picker,
  });
