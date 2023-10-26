/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeCreateInput } from '../models/IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeCreateInput';
import type { IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto } from '../models/IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto';
// import type { IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeUpdateInput } from '../models/IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InvitationCodeService {

    /**
     * 新增
     * @returns IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto Success
     * @throws ApiError
     */
    public static postApiChatInvitationCode({
requestBody,
}: {
requestBody?: IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeCreateInput,
}): CancelablePromise<IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/invitation-code',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatInvitationCode({
keyword,
maxResultCount,
skipCount,
sorting,
}: {
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
            url: '/api/chat/invitation-code',
            query: {
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatInvitationCodeDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/invitation-code/{id}/delete',
            path: {
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatInvitationCodeDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/invitation-code/delete-many',
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
     * 获取一条记录 Get
     * @returns IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto Success
     * @throws ApiError
     */
    public static getApiChatInvitationCode1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/invitation-code/{id}',
            path: {
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
     * 获取多条数据
     * @returns IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto Success
     * @throws ApiError
     */
    public static getApiChatInvitationCodeMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/invitation-code/many',
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
     * @returns IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto Success
     * @throws ApiError
     */
    public static postApiChatInvitationCodeUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeUpdateInput,
}): CancelablePromise<IczpNet_Chat_InvitationCodes_Dtos_InvitationCodeDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/invitation-code/{id}/update',
            path: {
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
