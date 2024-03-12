/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */

import { AxiosProgressEvent, AxiosRequestConfig, ResponseType } from 'axios';

export interface ApiRequestConfig extends AxiosRequestConfig {}

/* eslint-disable */
export type ApiRequestOptions = {
  readonly method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
  readonly url: string;
  readonly path?: Record<string, any>;
  readonly cookies?: Record<string, any>;
  readonly headers?: Record<string, any>;
  readonly query?: Record<string, any>;
  readonly formData?: Record<string, any>;
  readonly body?: any;
  readonly responseType?: ResponseType;
  readonly mediaType?: string;
  readonly responseAll?: boolean;
  readonly responseHeader?: string;
  readonly errors?: Record<number, string>;
  readonly onUploadProgress?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  readonly onDownloadProgress?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
};
