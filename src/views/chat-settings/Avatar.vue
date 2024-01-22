<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// https://vue-cropper.vercel.app/#/guide
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

import RoleFromModal from './widget/RoleFormModal.vue';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();

const cropper = ref<InstanceType<typeof VueCropper> | null>();
const currentImg = ref(
  'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg',
);
const loading = ref(false);
const click = () => {
  console.log('cropper.value');

  loading.value = true;
  cropper.value.getCropData((d: any) => {
    avatarSrc.value = d;
    // console.log(d);
  });
};

const open = (img: any) => {
  // ElMessageBox.alert(`<img src="${img}">`, '截图成功', {
  //   dangerouslyUseHTMLString: true,
  //   confirmButtonText: '确定'
  // })
};

const handleUpload = (img: string) => {
  currentImg.value = img;
};

const handleChange = (data: { raw: any }) => {
  // loadFile(data.raw).then((res: string) => {
  //   currentImg.value = res;
  // }).catch((e: any) => {
  //   console.error(e)
  //   ElMessage.error('上传失败')
  // })
};

const formModal = ref<InstanceType<typeof RoleFromModal> | null>();

const add = () => {};

const remove = (targetKey: string) => {};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey as string);
  }
};

const avatarSrc = ref();

const cropMoving = (d: any) => {
  // console.log(d.url);
  // avatarSrc.value = d.url + `?t=${Math.random()}`;
};
const wrapper = reactive({
  width: '400px',
  height: '400px',
});

const cropLayout = reactive({
  width: 300,
  height: 300,
});
</script>

<template>
  <page>
    <page-title :title="t('Session Avatar')" description="managermemt" />
    <!-- <RoleFromModal ref="formModal" /> -->
    <page-content>
      <div>
        <a-button type="text" @click="click">add</a-button>

        <a-avatar :src="avatarSrc" :size="64" />
      </div>
      <vue-cropper
        ref="cropper"
        :fixed="true"
        :info="false"
        :canScale="false"
        :autoCrop="true"
        :centerBox="true"
        :wrapper="wrapper"
        :crop-layout="cropLayout"
        :img="currentImg"
        @img-upload="handleUpload"
        @realTime="cropMoving"
        center-wrapper
      ></vue-cropper>
    </page-content>
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 20px;
}
</style>
