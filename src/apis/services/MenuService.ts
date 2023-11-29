/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Menus_Dtos_MenuCreateInput } from '../models/IczpNet_Chat_Menus_Dtos_MenuCreateInput';
import type { IczpNet_Chat_Menus_Dtos_MenuDto } from '../models/IczpNet_Chat_Menus_Dtos_MenuDto';
// import type { IczpNet_Chat_Menus_Dtos_MenuDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Menus_Dtos_MenuDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Menus_Dtos_MenuUpdateInput } from '../models/IczpNet_Chat_Menus_Dtos_MenuUpdateInput';
import type { IczpNet_Chat_Menus_MenuInfo } from '../models/IczpNet_Chat_Menus_MenuInfo';
// import type { IczpNet_Chat_Menus_MenuInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Menus_MenuInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MenuService {

    /**
     * 添加菜单
     * @returns IczpNet_Chat_Menus_Dtos_MenuDto Success
     * @throws ApiError
     */
    public static postApiChatMenu({
requestBody,
}: {
requestBody?: IczpNet_Chat_Menus_Dtos_MenuCreateInput,
}): CancelablePromise<IczpNet_Chat_Menus_Dtos_MenuDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/menu',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Menus_Dtos_MenuDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatMenu({
ownerId,
isEnabledParentId = false,
parentId,
depthList,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 所属聊天对角
 */
ownerId?: number,
/**
 * 是否启用 ParentId
 */
isEnabledParentId?: boolean,
/**
 * 父级Id,当IsEnabledParentId=false时,查询全部
 */
parentId?: string,
/**
 * 层级
 */
depthList?: Array<number>,
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
            url: '/api/chat/menu',
            query: {
                'OwnerId': ownerId,
                'IsEnabledParentId': isEnabledParentId,
                'ParentId': parentId,
                'DepthList': depthList,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * 删除一条数据
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatMenuDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/menu/{id}/delete',
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
    public static postApiChatMenuDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/menu/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条数据
     * @returns IczpNet_Chat_Menus_Dtos_MenuDto Success
     * @throws ApiError
     */
    public static getApiChatMenu1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_Menus_Dtos_MenuDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 列表(缓存)
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Menus_MenuInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatMenuByCache({
isEnabledParentId = false,
depthList,
parentId,
keyword,
sorting,
skipCount,
maxResultCount,
}: {
isEnabledParentId?: boolean,
depthList?: Array<number>,
parentId?: string,
keyword?: string,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/by-cache',
            query: {
                'IsEnabledParentId': isEnabledParentId,
                'DepthList': depthList,
                'ParentId': parentId,
                'Keyword': keyword,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
            },
            
        });
    }

    /**
     * 获取一条数据(缓存)
     * @returns IczpNet_Chat_Menus_MenuInfo Success
     * @throws ApiError
     */
    public static getApiChatMenuItemByCache({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_Menus_MenuInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/{id}/item-by-cache',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取多条数据(缓存)
     * @returns IczpNet_Chat_Menus_MenuInfo Success
     * @throws ApiError
     */
    public static getApiChatMenuManayByCache({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_Menus_MenuInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/manay-by-cache',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_Menus_Dtos_MenuDto Success
     * @throws ApiError
     */
    public static getApiChatMenuMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_Menus_Dtos_MenuDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 修复数据（fullPath,fullName,childrenCount,depth等）
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatMenuRepairData({
maxResultCount = 100,
skinCount,
}: {
/**
 * 每次修复最大数量（过多可能导致数据库超时）
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skinCount?: number,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/menu/repair-data',
            query: {
                'maxResultCount': maxResultCount,
                'skinCount': skinCount,
            },
            
        });
    }

    /**
     * 菜单触发器(调用后台作业)
     * @returns string Success
     * @throws ApiError
     */
    public static getApiChatMenuTrigger({
id,
}: {
/**
 * 菜单Id
 */
id: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/menu/{id}/trigger',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 修改菜单
     * @returns IczpNet_Chat_Menus_Dtos_MenuDto Success
     * @throws ApiError
     */
    public static postApiChatMenuUpdate({
id,
requestBody,
}: {
/**
 * 菜单Id
 */
id: string,
requestBody?: IczpNet_Chat_Menus_Dtos_MenuUpdateInput,
}): CancelablePromise<IczpNet_Chat_Menus_Dtos_MenuDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/menu/{id}/update',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}
