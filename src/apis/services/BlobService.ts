/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BlobService {

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static getBlob({
id,
}: {
id?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Blob',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postBlob({
container,
folder,
formData,
}: {
container?: string,
folder?: string,
formData?: {
file?: Blob;
},
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Blob',
            query: {
                'container': container,
                'folder': folder,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            
        });
    }

}
