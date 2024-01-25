import { ref } from 'vue';
import { ChatObjectDetailDto } from '../../../apis/dtos';

export const useOwner = () => {
  const owner = ref<ChatObjectDetailDto>();


  
  const memberCount = ref(0);
  return {
    owner,
    memberCount,
  };
};
