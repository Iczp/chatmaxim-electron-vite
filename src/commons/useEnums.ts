import { useI18n } from 'vue-i18n';
import { enumToKeyValues } from './utils';
import { computed } from 'vue';
import { ChatObjectTypeEnums, GenderEnums, VerificationMethodEnums } from '../apis/enums';

export const useEnums = () => {
  const { t } = useI18n();
  const genderOptions = computed(() => enumToKeyValues(GenderEnums, 'Gender:', t));
  const verificationMethodOptions = computed(() =>
    enumToKeyValues(VerificationMethodEnums, 'VerificationMethod:', t),
  );
  const objectTypeOptions = computed(() => enumToKeyValues(ChatObjectTypeEnums, 'ObjectType:', t));
  return { genderOptions, verificationMethodOptions, objectTypeOptions };
};
