import { ref } from 'vue';
import { FileService } from '../apis/services/FileService';
import { useObjectUrl } from '@vueuse/core';
import { AxiosProgressEvent } from 'axios';

export const blobMap = new Map<string, string>();

export const useDownload = () => {
  const blobUrl = ref<string>();

  const error = ref<string>();

  const isPending = ref(false);

  const progress = ref<number>();

  const blob = ref<Blob>();

  const onDownloadProgress = ref<(progressEvent: AxiosProgressEvent) => void>();

  const downloadFile = (url: string) =>
    new Promise<string>((resolve, reject) => {
      // console.log('url', url);
      blobUrl.value = undefined;

      blob.value = undefined;

      error.value = undefined;

      progress.value = undefined;

      var blobValue = blobMap.get(url);

      if (blobValue) {
        blobUrl.value = blobValue;
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
          blob.value = res;
          console.log('file', typeof res);
          const objUrl = useObjectUrl(res);
          blobUrl.value = objUrl.value;
          console.log('blob', objUrl);
          blobMap.set(url, objUrl.value!);
          resolve(objUrl.value!);
        })
        .catch(err => {
          blobUrl.value = undefined;
          error.value = 'load error';
          console.log('err', err);
          reject(err);
        })
        .finally(() => {
          isPending.value = false;
        });
    });

  return { downloadFile, isPending, error, blobUrl, blob, onDownloadProgress };
};
