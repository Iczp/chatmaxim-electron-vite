import { Ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileModalArgsType } from '../widget/ProfileModal.vue';
import ProfileModal from './widget/ProfileModal.vue';
export const useProfileModal = () => {
  const route = useRoute();
  const profileModal = inject('profile') as Ref<InstanceType<typeof ProfileModal> | null>;
  const open = (args: ProfileModalArgsType) => profileModal.value?.open(args);
  const showProfile = (destinationSessionUnitId: string, name?: string) => {
    const chatObjectId = inject<number>('chatObjectId') || Number(route.params.chatObjectId);
    const sessionUnitId = inject<string>('sessionUnitId') || (route.params.sessionUnitId as string);
    open({
      sessionUnitId,
      chatObjectId,
      destinationSessionUnitId,
      name,
    });
  };

  return { open, showProfile };
};
