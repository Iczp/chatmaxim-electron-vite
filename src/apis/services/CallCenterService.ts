/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CallCenterService {

    /**
     * 转接
     * @param sessionUnitId 当前会话单元Id
     * @param destinationId 目标会话单元Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatCallCenterTransferTo(
sessionUnitId: string,
destinationId: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/call-center/transfer-to',
            query: {
                'sessionUnitId': sessionUnitId,
                'destinationId': destinationId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

}
