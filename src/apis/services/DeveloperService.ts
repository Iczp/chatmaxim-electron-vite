/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Developers_Dtos_DecryptOutput } from '../models/IczpNet_Chat_Developers_Dtos_DecryptOutput';
import type { IczpNet_Chat_Developers_Dtos_DeveloperDto } from '../models/IczpNet_Chat_Developers_Dtos_DeveloperDto';
import type { IczpNet_Chat_Developers_Dtos_EncryptInput } from '../models/IczpNet_Chat_Developers_Dtos_EncryptInput';
import type { IczpNet_Chat_Developers_Dtos_EncryptOutput } from '../models/IczpNet_Chat_Developers_Dtos_EncryptOutput';
import type { IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput } from '../models/IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DeveloperService {

    /**
     * Base64转String
     * @param base64String 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatDeveloperBase64ToString(
base64String?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/base64To-string',
            query: {
                'base64String': base64String,
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
     * 解密
     * @param echo 密文
     * @param chatObjectId 公众号Id
     * @param encodingAesKey 公众平台上，开发者设置的 EncodingAesKey
     * @param token 公众平台上，开发者设置的 Token
     * @returns IczpNet_Chat_Developers_Dtos_DecryptOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperDecrypt(
echo?: string,
chatObjectId?: string,
encodingAesKey?: string,
token?: string,
): CancelablePromise<IczpNet_Chat_Developers_Dtos_DecryptOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/decrypt',
            query: {
                'Echo': echo,
                'ChatObjectId': chatObjectId,
                'EncodingAesKey': encodingAesKey,
                'Token': token,
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
     * 加密
     * @param requestBody 
     * @returns IczpNet_Chat_Developers_Dtos_EncryptOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperEncrypt(
requestBody?: IczpNet_Chat_Developers_Dtos_EncryptInput,
): CancelablePromise<IczpNet_Chat_Developers_Dtos_EncryptOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/encrypt',
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
     * 生成 EncodingAesKey(43)
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatDeveloperGenerateEncodingAesKey(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/generate-encoding-aes-key',
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
     * 生成签名
     * @param token 公众平台上，开发者设置的 Token
     * @param nonce 随机串，对应URL参数的 nonce
     * @param timeStamp 时间戳，对应URL参数的 timestamp
     * @param echo 随机串，对应URL参数的 Echo
     * @returns IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperGenerateSignature(
token?: string,
nonce?: string,
timeStamp?: string,
echo?: string,
): CancelablePromise<IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/generate-signature',
            query: {
                'Token': token,
                'Nonce': nonce,
                'TimeStamp': timeStamp,
                'Echo': echo,
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
     * @param id 
     * @returns IczpNet_Chat_Developers_Dtos_DeveloperDto Success
     * @throws ApiError
     */
    public static getApiChatDeveloper(
id: number,
): CancelablePromise<IczpNet_Chat_Developers_Dtos_DeveloperDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/developer/{id}',
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
     * 开发者设置
     * @param id 主建Id
     * @param token 开发者设置的Token
     * @param encodingAesKey 开发者设置的EncodingAESKey
     * @param postUrl 开发者设置 的 Url
     * @returns IczpNet_Chat_Developers_Dtos_DeveloperDto Success
     * @throws ApiError
     */
    public static postApiChatDeveloperSetConfig(
id: number,
token: string = '95fd7796cc15d9f81f3f79dbc090ab03fb2941ef',
encodingAesKey: string = 'GUhGDQKNcRpnp4XHQtnJY24MXWmMGV64KtahF3tjUQd',
postUrl: string = 'https://',
): CancelablePromise<IczpNet_Chat_Developers_Dtos_DeveloperDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/{id}/set-config',
            path: {
                'id': id,
            },
            query: {
                'Token': token,
                'EncodingAesKey': encodingAesKey,
                'PostUrl': postUrl,
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
     * 启用与关闭
     * @param id 主建Id
     * @param isEnabled 
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatDeveloperSetIsEnabled(
id: number,
isEnabled?: boolean,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/{id}/set-is-enabled',
            path: {
                'id': id,
            },
            query: {
                'isEnabled': isEnabled,
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
     * String转Base64
     * @param input 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatDeveloperStringToBase64(
input?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/string-to-base64',
            query: {
                'input': input,
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
     * 验证签名
     * @param signature 签名 signature
     * @param token 公众平台上，开发者设置的Token
     * @param timeStamp 时间戳
     * @param nonce 随机数
     * @param cipherText 密文
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatDeveloperVerifySignature(
signature?: string,
token?: string,
timeStamp?: string,
nonce?: string,
cipherText?: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/verify-signature',
            query: {
                'Signature': signature,
                'Token': token,
                'TimeStamp': timeStamp,
                'Nonce': nonce,
                'CipherText': cipherText,
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

}
