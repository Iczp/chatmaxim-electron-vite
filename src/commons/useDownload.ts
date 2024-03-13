import { ref } from 'vue';
import { FileService } from '../apis/services/FileService';
import { useObjectUrl } from '@vueuse/core';
import { AxiosProgressEvent } from 'axios';

export type BlobCacheItem = {
  url: string;
  objectUrl: string;
  blob: Blob;
  date: Date;
};

export const blobStore = new Map<string, BlobCacheItem>();

export const useDownload = () => {
  const blobUrl = ref<string>();
  const error = ref<string>();
  const isPending = ref(false);
  const progress = ref<number>();
  const blob = ref<Blob>();
  const onDownloadProgress = ref<(progressEvent: AxiosProgressEvent) => void>();

  const downloadFile = (url: string) =>
    new Promise<BlobCacheItem>((resolve, reject) => {
      // console.log('url', url);
      blobUrl.value = undefined;
      blob.value = undefined;
      error.value = undefined;
      progress.value = undefined;

      var cacheItem = blobStore.get(url);
      if (cacheItem) {
        blobUrl.value = cacheItem.objectUrl;
        blob.value = cacheItem.blob;
        console.log(`downloadFile is loaded: ${blobUrl.value}`);
        resolve(cacheItem);
        return;
        // url = blobValue;
      }
      isPending.value = true;
      console.log(`downloadFile: ${url}`);

      FileService.download({
        url,
        onDownloadProgress(progressEvent) {
          console.log('onDownloadProgress', progressEvent);
          progress.value = progressEvent.progress;
          onDownloadProgress.value?.(progressEvent);
        },
      })
        .then(res => {
          console.log('file', res);
          const objUrl = useObjectUrl(res);
          blobUrl.value = objUrl.value;
          blob.value = res;
          const cacheItem = <BlobCacheItem>{
            url,
            blob: res,
            objectUrl: objUrl.value!,
            date: new Date(),
          };
          console.log('cacheItem', cacheItem);
          blobStore.set(url, cacheItem);
          resolve(cacheItem);
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
