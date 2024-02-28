<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// https://vue-cropper.vercel.app/#/guide
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

import RoleFromModal from './widget/RoleFormModal.vue';
import { ChatObjectService } from '../../apis';
import { useDestination } from './commons/useDestination';
import { message } from 'ant-design-vue';
import { useFileDialog, useObjectUrl } from '@vueuse/core';
import { formatUrl } from '../../commons/utils';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const { sessionUnit, portrait, tryChangePortrait } = useDestination(props.sessionUnitId!);

const destinationId = computed(() => sessionUnit.value?.destination?.id);

// const portrait = formatUrl(sessionUnit.value?.destination?.portrait);

const previewImg = computed(() => previews.value.url || portrait.value);
const currentImg = ref<string>();

const { files, open, reset, onChange } = useFileDialog({
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

const loading = ref(false);
const chooseFile = () => {
  open({
    multiple: false,
  });
  console.log('cropper.value');

  // loading.value = true;
  // cropper.value.getCropData((d: any) => {
  //   avatarSrc.value = d;
  //   // console.log(d);
  // });
};

const open1 = (img: any) => {
  // ElMessageBox.alert(`<img src="${img}">`, '截图成功', {
  //   dangerouslyUseHTMLString: true,
  //   confirmButtonText: '确定'
  // })
};

const handleUpload = (img: string) => {
  console.log('handleUpload', img);

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
    ChatObjectService.uploadPortrait({
      id: destinationId.value,
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
  // console.log('formState!', toRaw(formState));
  // console.log('entryState!', toRaw(entryState));
  // // return;
  // const key = 'session-change-name';
  // isPending.value = true;
  // ChatObjectService.postApiChatChatObjectUpdate({
  //   id: Number(props.chatObjectId),
  //   // name: formState.name,
  //   requestBody: toRaw(formState),
  // })
  //   .then(res => {
  //     message.success({ content: `ok`, key });
  //     payload.value!.owner = res;
  //   })
  //   .catch(err => {
  //     message.error({ content: err?.body?.error?.message, key });
  //   })
  //   .finally(() => {
  //     isPending.value = false;
  //   });
};
const onCancel = () => {
  currentImg.value = undefined;
};
const previewStyle1 = ref({});

const previews = ref({
  w: 64,
  h: 64,
  div: undefined,
  url: undefined,
  img: undefined,
});
const realTime = (data: any) => {
  // console.log(data);
  var h = 0.5;
  var w = 0.2;
  previews.value = data;
  // avatarSrc.value = d.url + `?t=${Math.random()}`;
  // previews.value.url = data.url
  previewStyle1.value = {
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
    <page-title :title="t('Session Portrait')" description="managermemt" />
    <!-- <RoleFromModal ref="formModal" /> -->
    <page-content>
      <div class="aa">
        <div class="preview-wrapper" @click="chooseFile">
          <img v-if="!currentImg" :src="portrait" class="portrait-img" />
          <div v-else :style="previewStyle1">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </div>
        </div>
      </div>
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
      ></vue-cropper>
    </page-content>
    <page-footer class="flex-end">
      <a-space>
        <a-button @click="onCancel">{{ t('Cancel') }}</a-button>

        <a-button @click="chooseFile">{{ t('Cancel') }}</a-button>
        <a-button type="primary" :loading="isPending" style="margin-left: 10px" @click="onSubmit">
          {{ t('Confirm') }}
        </a-button>
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 20px;
}
.aa {
  display: flex;
  flex-direction: row;
  height: 64px;
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
