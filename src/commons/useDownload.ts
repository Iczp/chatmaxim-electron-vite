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
  const percent = ref<number>();
  const blob = ref<Blob>();
  const onDownloadProgress = ref<(progressEvent: AxiosProgressEvent) => void>();

  const downloadFile = (url: string) =>
    new Promise<BlobCacheItem>((resolve, reject) => {
      // console.log('url', url);
      blobUrl.value = undefined;
      blob.value = undefined;
      error.value = undefined;
      percent.value = 0;
      const cacheKey = url;
      var cacheItem = blobStore.get(cacheKey);
      if (cacheItem) {
        blobUrl.value = cacheItem.objectUrl;
        // blob.value = cacheItem.blob;
        console.log(`downloadFile is loaded: ${blobUrl.value}`);
        // resolve(cacheItem);
        // return;
        url = cacheItem.objectUrl;
      }
      isPending.value = true;
      console.log(`downloadFile: ${url}`);

      FileService.download({
        url,
        onDownloadProgress(progressEvent) {
          console.log('onDownloadProgress', progressEvent);
          percent.value = Math.floor((progressEvent.progress || 0) * 100);
          onDownloadProgress.value?.(progressEvent);
        },
      })
        .then(res => {
          console.log('file', res);
          if (!cacheItem) {
            const objUrl = useObjectUrl(res);
            blobUrl.value = objUrl.value;
          }
          blob.value = res;
          const blobItem = <BlobCacheItem>{
            // url,
            // blob: res,
            objectUrl: blobUrl.value!,
            date: new Date(),
          };
          console.log('blobItem', blobItem);
          blobStore.set(cacheKey, blobItem);
          // blobItem.blob = res;
          resolve({ ...blobItem, blob: res });
          console.log('blobStore', blobStore);
        })
        .catch(err => {
          blobUrl.value = undefined;
          error.value = 'load error';
          console.log('err', err);
          reject(err);
        })
        .finally(() => {
          setTimeout(() => {
            isPending.value = false;
          }, 1000);
        });
    });

  return { downloadFile, isPending, error, blobUrl, blob, onDownloadProgress, percent };
};
