import { AxiosProgressEvent } from 'axios';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileService {
  /**
   * @returns string Success
   * @throws ApiError
   */
  public static get({
    id,
    onDownloadProgress,
  }: {
    id?: string;
    onDownloadProgress?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  }): CancelablePromise<Blob> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/File',
      responseType: 'blob',
      onDownloadProgress,
      query: {
        id: id,
      },
    });
  }

  /**
   * @returns string Success
   * @throws ApiError
   */
  public static download({
    url,
    onDownloadProgress,
  }: {
    url: string;
    onDownloadProgress?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  }): CancelablePromise<Blob> {
    return __request(OpenAPI, {
      method: 'GET',
      url,
      responseType: 'blob',
      onDownloadProgress,
    });
  }
}
