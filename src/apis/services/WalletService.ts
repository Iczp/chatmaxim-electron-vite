/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Wallets_Dtos_RechargeInput } from '../models/IczpNet_Chat_Wallets_Dtos_RechargeInput';
import type { IczpNet_Chat_Wallets_Dtos_WalletDetailDto } from '../models/IczpNet_Chat_Wallets_Dtos_WalletDetailDto';
import type { IczpNet_Chat_Wallets_Dtos_WalletDto } from '../models/IczpNet_Chat_Wallets_Dtos_WalletDto';
import type { IczpNet_Chat_Wallets_Dtos_WalletDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Wallets_Dtos_WalletDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WalletService {

    /**
     * @returns IczpNet_Chat_Wallets_Dtos_WalletDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWallet({
id,
}: {
id: string,
}): CancelablePromise<IczpNet_Chat_Wallets_Dtos_WalletDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet/{id}',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Wallets_Dtos_WalletDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatWallet1({
ownerId,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
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
            url: '/api/chat/wallet',
            query: {
                'OwnerId': ownerId,
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
     * @returns IczpNet_Chat_Wallets_Dtos_WalletDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWalletMany({
idList,
}: {
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_Wallets_Dtos_WalletDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet/many',
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
     * @returns IczpNet_Chat_Wallets_Dtos_WalletDto Success
     * @throws ApiError
     */
    public static postApiChatWalletRecharge({
requestBody,
}: {
requestBody?: IczpNet_Chat_Wallets_Dtos_RechargeInput,
}): CancelablePromise<IczpNet_Chat_Wallets_Dtos_WalletDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/wallet/recharge',
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
