/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Mottos_Dtos_MottoDetailDto } from '../models/IczpNet_Chat_Mottos_Dtos_MottoDetailDto';
// import type { IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MottoAdminService {

    /**
     * 删除一条数据
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatMottoAdminDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto-admin/{id}/delete',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 删除多条数据
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatMottoAdminDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/motto-admin/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条记录 Get
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static getApiChatMottoAdmin({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_Mottos_Dtos_MottoDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto-admin/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Mottos_Dtos_MottoDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatMottoAdmin1({
ownerId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
ownerId?: number,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto-admin',
            query: {
                'OwnerId': ownerId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_Mottos_Dtos_MottoDetailDto Success
     * @throws ApiError
     */
    public static getApiChatMottoAdminMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_Mottos_Dtos_MottoDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/motto-admin/many',
            query: {
                'idList': idList,
            },
            
        });
    }

}
