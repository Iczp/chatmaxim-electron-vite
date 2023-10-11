/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Articles_Dtos_ArticleCreateInput } from '../models/IczpNet_Chat_Articles_Dtos_ArticleCreateInput';
import type { IczpNet_Chat_Articles_Dtos_ArticleDetailDto } from '../models/IczpNet_Chat_Articles_Dtos_ArticleDetailDto';
import type { IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Articles_Dtos_ArticleUpdateInput } from '../models/IczpNet_Chat_Articles_Dtos_ArticleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArticleService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatArticle(
requestBody?: IczpNet_Chat_Articles_Dtos_ArticleCreateInput,
): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/article',
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
     * @param ownerId 群主
     * @param type 
     * @param minCount 
     * @param maxCount 
     * @param isForbiddenAll 是否全体禁言
     * @param memberOwnerId 成员所在的群(我加入的群)
     * @param forbiddenMemberOwnerId 成员被禁言的群
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatArticle(
ownerId?: string,
type?: 0,
minCount?: number,
maxCount?: number,
isForbiddenAll?: boolean,
memberOwnerId?: string,
forbiddenMemberOwnerId?: string,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/article',
            query: {
                'OwnerId': ownerId,
                'Type': type,
                'MinCount': minCount,
                'MaxCount': maxCount,
                'IsForbiddenAll': isForbiddenAll,
                'MemberOwnerId': memberOwnerId,
                'ForbiddenMemberOwnerId': forbiddenMemberOwnerId,
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
     * @param id 主键Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatArticleDelete(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/article/{id}/delete',
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
     * @param requestBody 主键Id[多个]
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatArticleDeleteMany(
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/article/delete-many',
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
     * @param id 主键Id
     * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatArticle1(
id: string,
): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/article/{id}',
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
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatArticleMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_Articles_Dtos_ArticleDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/article/many',
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
     * @param id 主键Id
     * @param requestBody 
     * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatArticleUpdate(
id: string,
requestBody?: IczpNet_Chat_Articles_Dtos_ArticleUpdateInput,
): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/article/{id}/update',
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
