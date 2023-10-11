/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Mottos_Dtos_MottoCreateInput } from '../models/IczpNet_Chat_Mottos_Dtos_MottoCreateInput';
import type { IczpNet_Chat_Mottos_Dtos_MottoDetailDto } from '../models/IczpNet_Chat_Mottos_Dtos_MottoDetailDto';
import type { IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Mottos_Dtos_MottoUpdateInput } from '../models/IczpNet_Chat_Mottos_Dtos_MottoUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MottoService {

    /**
     * 新增
     * @param ownerId 聊天对象Id
     * @param requestBody 
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static postApiChatMotto(
ownerId: number,
requestBody?: IczpNet_Chat_Mottos_Dtos_MottoCreateInput,
): CancelablePromise<IczpNet_Chat_Mottos_Dtos_MottoDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto',
            query: {
                'ownerId': ownerId,
            },
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
     * 获取列表
     * @param ownerId 聊天对象Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatMotto(
ownerId: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto',
            query: {
                'ownerId': ownerId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * 删除一条数据
     * @param ownerId 聊天对象Id
     * @param id 主建Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatMottoDeleteBy(
ownerId: number,
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto/{id}/delete-by/{ownerId}',
            path: {
                'ownerId': ownerId,
                'id': id,
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
     * 删除多条数据
     * @param ownerId 聊天对象Id
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatMottoDeleteMany(
ownerId: number,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto/delete-many/{ownerId}',
            path: {
                'ownerId': ownerId,
            },
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
     * 获取一条数据
     * @param ownerId 聊天对象Id
     * @param id 主建Id
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static getApiChatMotto1(
ownerId: number,
id: string,
): CancelablePromise<IczpNet_Chat_Mottos_Dtos_MottoDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto/{id}',
            path: {
                'id': id,
            },
            query: {
                'ownerId': ownerId,
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
     * 获取多条数据
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static getApiChatMottoMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_Mottos_Dtos_MottoDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto/many',
            query: {
                'idList': idList,
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
     * 修改
     * @param ownerId 聊天对象Id
     * @param id 主建Id
     * @param requestBody 
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static postApiChatMottoUpdate(
ownerId: number,
id: string,
requestBody?: IczpNet_Chat_Mottos_Dtos_MottoUpdateInput,
): CancelablePromise<IczpNet_Chat_Mottos_Dtos_MottoDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto/{id}/update/{ownerId}',
            path: {
                'ownerId': ownerId,
                'id': id,
            },
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
