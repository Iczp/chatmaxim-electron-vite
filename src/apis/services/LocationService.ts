/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Locations_Dto_UserLocationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Locations_Dto_UserLocationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Locations_ShareLocationInput } from '../models/IczpNet_Chat_Locations_ShareLocationInput';
import type { IczpNet_Chat_Locations_ShareLocationOutput } from '../models/IczpNet_Chat_Locations_ShareLocationOutput';
import type { IczpNet_Chat_Locations_StopShareLocationInput } from '../models/IczpNet_Chat_Locations_StopShareLocationInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LocationService {

    /**
     * 获取媒体位置信息
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Locations_Dto_UserLocationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatLocation({
sessionUnitId,
}: {
/**
 * 会话单元
 */
sessionUnitId: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/location',
            query: {
                'sessionUnitId': sessionUnitId,
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

    /**
     * 共享位置
     * @returns IczpNet_Chat_Locations_ShareLocationOutput Success
     * @throws ApiError
     */
    public static postApiChatLocationSharing({
requestBody,
}: {
requestBody?: IczpNet_Chat_Locations_ShareLocationInput,
}): CancelablePromise<IczpNet_Chat_Locations_ShareLocationOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/location/sharing',
            body: requestBody,
            mediaType: 'application/json',
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

    /**
     * 停止共享位置（立即）
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatLocationStopSharing({
requestBody,
}: {
requestBody: IczpNet_Chat_Locations_StopShareLocationInput,
}): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/location/stop-sharing',
            body: requestBody,
            mediaType: 'application/json',
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
