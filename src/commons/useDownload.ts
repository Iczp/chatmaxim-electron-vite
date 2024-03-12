import { ref } from 'vue';
import { FileService } from '../apis/services/FileService';
import { useObjectUrl } from '@vueuse/core';
import { AxiosProgressEvent } from 'axios';

export const blobMap = new Map<string, string>();

export const useDownload = () => {
  
  const objectUrl = ref<string>();

  const error = ref<string>();

  const isPending = ref(false);

  const progress = ref<number>();

  const onDownloadProgress = ref<(progressEvent: AxiosProgressEvent) => void>();

  const downloadFile = (url: string) => {
    // console.log('url', url);
    objectUrl.value = undefined;

    error.value = undefined;

    progress.value = undefined;

    var blobValue = blobMap.get(url);

    if (blobValue) {
      objectUrl.value = blobValue;
      return;
    }

    isPending.value = true;

    FileService.download({
      url,
      onDownloadProgress(progressEvent) {
        console.log('onDownloadProgress', progressEvent);
        progress.value = progressEvent.progress;
        onDownloadProgress.value?.(progressEvent);
      },
    })
      .then(res => {
        console.log('file', typeof res);
        const blob = useObjectUrl(res);
        objectUrl.value = blob.value;
        console.log('blob', blob);
        blobMap.set(url, blob.value!);
      })
      .catch(err => {
        objectUrl.value = undefined;
        error.value = 'load error';
        console.log('err', err);
      })
      .finally(() => {
        isPending.value = false;
      });
  };

  return { downloadFile, isPending, error, objectUrl, onDownloadProgress };
};
