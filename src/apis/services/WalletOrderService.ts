/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_WalletOrders_Dtos_WalletOrderCreateInput } from '../models/IczpNet_Chat_WalletOrders_Dtos_WalletOrderCreateInput';
import type { IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto } from '../models/IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto';
import type { IczpNet_Chat_WalletOrders_Dtos_WalletOrderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_WalletOrders_Dtos_WalletOrderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_WalletOrders_Dtos_WalletOrderUpdateInput } from '../models/IczpNet_Chat_WalletOrders_Dtos_WalletOrderUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WalletOrderService {

    /**
     * @returns IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWalletOrderClose({
id,
}: {
id: string,
}): CancelablePromise<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet-order/{id}/close',
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
     * @returns IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWalletOrder({
requestBody,
}: {
requestBody?: IczpNet_Chat_WalletOrders_Dtos_WalletOrderCreateInput,
}): CancelablePromise<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet-order',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatWalletOrder({
ownerId,
businessId,
status,
businessType,
minAmount,
maxAmount,
isEnabled,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
}: {
ownerId?: number,
businessId?: string,
status?: 0 | 1 | 2 | 3 | 4,
businessType?: 0 | 1 | -1,
minAmount?: number,
maxAmount?: number,
isEnabled?: boolean,
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
            url: '/api/chat/wallet-order',
            query: {
                'OwnerId': ownerId,
                'BusinessId': businessId,
                'Status': status,
                'BusinessType': businessType,
                'MinAmount': minAmount,
                'MaxAmount': maxAmount,
                'IsEnabled': isEnabled,
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
    public static postApiChatWalletOrderDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet-order/{id}/delete',
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
    public static postApiChatWalletOrderDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet-order/delete-many',
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
     * @returns IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWalletOrder1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet-order/{id}',
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
     * @returns IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWalletOrderMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet-order/many',
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
     * @returns IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWalletOrderUpdate({
id,
requestBody,
}: {
id: string,
requestBody?: IczpNet_Chat_WalletOrders_Dtos_WalletOrderUpdateInput,
}): CancelablePromise<IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet-order/{id}/update',
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
