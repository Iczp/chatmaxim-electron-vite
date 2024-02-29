<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// https://vue-cropper.vercel.app/#/guide
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { RoomService } from '../../apis';
import { useDestination } from './commons/useDestination';
import { message } from 'ant-design-vue';
import { useFileDialog, useObjectUrl } from '@vueuse/core';
import { formatUrl } from '../../commons/utils';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const { portrait, tryChangePortrait } = useDestination(props.sessionUnitId!);

const currentImg = ref<string>();

const { open, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  directory: false, // Select directories instead of files if set true
});

onChange((files: FileList) => {
  /** do something with files */
  console.log('onChange', files);
  const url = useObjectUrl(files[0]);
  currentImg.value = url.value!;
});

const cropper = ref<InstanceType<typeof VueCropper> | null>();

const chooseFile = () => {
  open({
    multiple: false,
  });
  console.log('cropper.value');
};

const handleUpload = (img: string) => {
  console.log('handleUpload', img);
  currentImg.value = img;
};

const wrapper = reactive({
  width: '128px',
  height: '128px',
});

const cropLayout = reactive({
  width: 240,
  height: 240,
});

const isPending = ref(false);
const onSubmit = () => {
  cropper.value.getCropBlob((file: any) => {
    // do something
    console.log(file);
    const key = 'upload-portrait';
    message.loading({ content: t('Uploading'), key });
    isPending.value = true;
    RoomService.uploadPortrait({
      sessionUnitId: props.sessionUnitId!,
      file,
      onUploadProgress(progressEvent) {
        console.log('uploadFile onUploadProgress', progressEvent);
      },
    })
      .then(res => {
        message.success({ content: t('UploadSuccessful'), key });
        const url = formatUrl(`/file/${res.id}`);
        // portrait.value = url!;
        tryChangePortrait(url!);
        currentImg.value = undefined;
      })
      .catch(err => {
        message.error({ content: err?.body?.error?.message, key });
      })
      .finally(() => {
        isPending.value = false;
      });
  });
};
const onCancel = () => {
  currentImg.value = undefined;
};
const previewStyle = ref({});

const previews = ref({
  w: 64,
  h: 64,
  div: undefined,
  url: undefined,
  img: undefined,
});
const realTime = (data: any) => {
  // console.log(data);
  previews.value = data;
  previewStyle.value = {
    width: data.w + 'px',
    height: data.h + 'px',
    overflow: 'hidden',
    margin: '0',
    zoom: 64 / data.w,
  };
};
</script>

<template>
  <page>
    <page-title :title="t('Session Portrait')" />
    <!-- <RoleFromModal ref="formModal" /> -->
    <page-content>
      <div class="header">
        <div class="preview-wrapper" @click="chooseFile">
          <img v-if="!currentImg" :src="portrait" class="portrait-img" />
          <div v-else :style="previewStyle">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </div>
        </div>
      </div>
      <div class="cropper-wrapper">
        <vue-cropper
          v-if="currentImg"
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
          @realTime="realTime"
          center-wrapper
        >
          <template #loading>
            <p>...</p>
          </template>
        </vue-cropper>
        <div v-else class="choose-section" @click="chooseFile">请选择图片</div>
      </div>
    </page-content>
    <page-footer class="flex-end">
      <a-space>
        <a-button v-if="currentImg" @click="onCancel">{{ t('Cancel') }}</a-button>
        <a-button @click="chooseFile">{{ t('Choose') }}</a-button>
        <a-button
          v-if="currentImg"
          type="primary"
          :loading="isPending"
          :disabled="isPending"
          @click="onSubmit"
        >
          {{ t('Confirm') }}
        </a-button>
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
.cropper-wrapper {
  display: flex;
  flex: 1;
  margin: 12px 20px;
}
:deep(.page-content) {
  /* margin-left: 20px; */
}
.header {
  display: flex;
  flex-direction: row;
  height: 64px;
  margin: 12px 20px;
}

.choose-section {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--chat-page-sub-title-color);
  border: 2px dashed var(--chat-page-sub-title-color);
  border-radius: 12px;
  /* margin: 12px 20px; */
  /* height: 120px; */
  cursor: pointer;
  flex: 1;
}
.preview-wrapper {
  display: flex;
  width: 64px;
  height: 64px;
  background-color: rgba(123, 123, 123, 0.506);
  overflow: hidden;
  border-radius: 50%;
}
.portrait-img {
  width: 100%;
  height: 100%;
  transition: all 0.3s linear;
}
.flex-end {
  justify-content: flex-end;
}
:deep(.cropper-view-box) {
  border-radius: 50%;
}
</style>
