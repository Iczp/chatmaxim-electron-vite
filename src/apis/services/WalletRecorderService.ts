/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto } from '../models/IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto';
// import type { IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WalletRecorderService {

    /**
     * @returns IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto Success
     * @throws ApiError
     */
    public static getApiChatWalletRecorder({
id,
}: {
id: string,
}): CancelablePromise<IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet-recorder/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatWalletRecorder1({
ownerId,
businessId,
minAmount,
maxAmount,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
ownerId?: number,
businessId?: string,
minAmount?: number,
maxAmount?: number,
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
            url: '/api/chat/wallet-recorder',
            query: {
                'OwnerId': ownerId,
                'BusinessId': businessId,
                'MinAmount': minAmount,
                'MaxAmount': maxAmount,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * @returns IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto Success
     * @throws ApiError
     */
    public static getApiChatWalletRecorderMany({
idList,
}: {
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/wallet-recorder/many',
            query: {
                'idList': idList,
            },
            
        });
    }

}
