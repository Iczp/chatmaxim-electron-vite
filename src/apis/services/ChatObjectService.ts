/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_ChatObjectInfo } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo';
import type { IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatObjectService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObject(
requestBody?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object',
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
     * 列表
     * @param chatObjectTypeId 聊天对象类型Id
     * @param isStatic 是否固定
     * @param isPublic 是否公开
     * @param isEnabled 是否可用
     * @param isDefault 是否默认
     * @param objectType 聊天对象类型:个人|群|服务号等
     * @param categoryIdList 
     * @param isImportChildCategory 包含下级
     * @param isEnabledParentId 是否启用 ParentId
     * @param parentId 父级Id,当IsEnabledParentId=false时,查询全部
     * @param depthList 层级
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObject(
chatObjectTypeId?: string,
isStatic?: boolean,
isPublic?: boolean,
isEnabled?: boolean,
isDefault?: boolean,
objectType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
categoryIdList: Array<string> = null,
isImportChildCategory: boolean = null,
isEnabledParentId: boolean = false,
parentId: number = null,
depthList: Array<number> = null,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object',
            query: {
                'ChatObjectTypeId': chatObjectTypeId,
                'IsStatic': isStatic,
                'IsPublic': isPublic,
                'IsEnabled': isEnabled,
                'IsDefault': isDefault,
                'ObjectType': objectType,
                'CategoryIdList': categoryIdList,
                'IsImportChildCategory': isImportChildCategory,
                'IsEnabledParentId': isEnabledParentId,
                'ParentId': parentId,
                'DepthList': depthList,
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
     * 创建聊天对象[机器人]
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectRobot(
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/robot',
            query: {
                'name': name,
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
     * 创建聊天对象[掌柜]
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectShopKeeper(
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/shop-keeper',
            query: {
                'name': name,
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
     * 创建聊天对象[店小二]
     * @param shopKeeperId 
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectShopWaiter(
shopKeeperId: number,
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/shop-waiter/{shopKeeperId}',
            path: {
                'shopKeeperId': shopKeeperId,
            },
            query: {
                'name': name,
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
     * 创建聊天对象[聊天广场]
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectSquare(
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/square',
            query: {
                'name': name,
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
    public static postApiChatChatObjectDeleteMany(
requestBody?: Array<number>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/delete-many',
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
     * @param id 主键Id
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static getApiChatChatObject1(
id: number,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/{id}',
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
     * 列表(缓存)
     * @param isEnabledParentId 
     * @param depthList 
     * @param parentId 
     * @param keyword 
     * @param sorting 
     * @param skipCount 
     * @param maxResultCount 
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectByCache(
isEnabledParentId: boolean = false,
depthList: Array<number> = null,
parentId: number = null,
keyword: string = null,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/by-cache',
            query: {
                'IsEnabledParentId': isEnabledParentId,
                'DepthList': depthList,
                'ParentId': parentId,
                'Keyword': keyword,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
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
     * 获取一条数据[code]
     * @param code 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectByCode(
code?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/by-code',
            query: {
                'code': code,
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
     * 获取详情
     * @param id 主建Id
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectDetail(
id: number,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/{id}/detail',
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
     * 获取一条数据(缓存)
     * @param id 主键Id
     * @returns IczpNet_Chat_ChatObjects_ChatObjectInfo Success
     * @throws ApiError
     */
    public static getApiChatChatObjectItemByCache(
id: number,
): CancelablePromise<IczpNet_Chat_ChatObjects_ChatObjectInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/{id}/item-by-cache',
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
     * 获取当前用户的聊天对象
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectByCurrentUser(
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/by-current-user',
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
     * 获取用户的聊天对象
     * @param userId 用户Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectByUserId(
userId: string,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/by-user-id/{userId}',
            path: {
                'userId': userId,
            },
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
     * 获取多条数据(缓存)
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_ChatObjects_ChatObjectInfo Success
     * @throws ApiError
     */
    public static getApiChatChatObjectManayByCache(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_ChatObjects_ChatObjectInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/manay-by-cache',
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
     * 获取多条数据
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectMany(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object/many',
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
     * 修复数据（fullPath,fullName,childrenCount,depth等）
     * @param maxResultCount 每次修复最大数量（过多可能导致数据库超时）
     * @param skinCount 跳过数量
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatChatObjectRepairData(
maxResultCount: number = 100,
skinCount?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/repair-data',
            query: {
                'maxResultCount': maxResultCount,
                'skinCount': skinCount,
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
     * 设置验证方式(好友|群|广场等)
     * @param id 主建Id
     * @param verificationMethod 验证方式
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectSetVerificationMethod(
id: number,
verificationMethod?: 0 | 1 | 2,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/{id}/set-verification-method',
            path: {
                'id': id,
            },
            query: {
                'verificationMethod': verificationMethod,
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
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectUpdate(
id: number,
requestBody?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/{id}/update',
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

    /**
     * 修改名称
     * @param id 主建Id
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectUpdateName(
id: number,
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object/{id}/update-name',
            path: {
                'id': id,
            },
            query: {
                'name': name,
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
     * 更新头像
     * @param id 主建Id
     * @param formData 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectUpdatePortrait(
id?: number,
formData?: {
file?: Blob;
},
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/ChatObject/UpdatePortrait',
            query: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
