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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatCallCenterTransferTo({
sessionUnitId,
destinationId,
}: {
/**
 * 当前会话单元Id
 */
sessionUnitId: string,
/**
 * 目标会话单元Id
 */
destinationId: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/call-center/transfer-to',
            query: {
                'sessionUnitId': sessionUnitId,
                'destinationId': destinationId,
            },
            
        });
    }

}
