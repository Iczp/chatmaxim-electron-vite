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
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatDeveloperBase64ToString({
base64String,
}: {
base64String?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/base64To-string',
            query: {
                'base64String': base64String,
            },
            
        });
    }

    /**
     * 解密
     * @returns IczpNet_Chat_Developers_Dtos_DecryptOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperDecrypt({
echo,
chatObjectId,
encodingAesKey,
token,
}: {
/**
 * 密文
 */
echo?: string,
/**
 * 公众号Id
 */
chatObjectId?: string,
/**
 * 公众平台上，开发者设置的 EncodingAesKey
 */
encodingAesKey?: string,
/**
 * 公众平台上，开发者设置的 Token
 */
token?: string,
}): CancelablePromise<IczpNet_Chat_Developers_Dtos_DecryptOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/decrypt',
            query: {
                'Echo': echo,
                'ChatObjectId': chatObjectId,
                'EncodingAesKey': encodingAesKey,
                'Token': token,
            },
            
        });
    }

    /**
     * 加密
     * @returns IczpNet_Chat_Developers_Dtos_EncryptOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperEncrypt({
requestBody,
}: {
requestBody?: IczpNet_Chat_Developers_Dtos_EncryptInput,
}): CancelablePromise<IczpNet_Chat_Developers_Dtos_EncryptOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/encrypt',
            body: requestBody,
            mediaType: 'application/json',
            
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
            
        });
    }

    /**
     * 生成签名
     * @returns IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput Success
     * @throws ApiError
     */
    public static postApiChatDeveloperGenerateSignature({
token,
nonce,
timeStamp,
echo,
}: {
/**
 * 公众平台上，开发者设置的 Token
 */
token?: string,
/**
 * 随机串，对应URL参数的 nonce
 */
nonce?: string,
/**
 * 时间戳，对应URL参数的 timestamp
 */
timeStamp?: string,
/**
 * 随机串，对应URL参数的 Echo
 */
echo?: string,
}): CancelablePromise<IczpNet_Chat_Developers_Dtos_GenerateSignatureOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/generate-signature',
            query: {
                'Token': token,
                'Nonce': nonce,
                'TimeStamp': timeStamp,
                'Echo': echo,
            },
            
        });
    }

    /**
     * @returns IczpNet_Chat_Developers_Dtos_DeveloperDto Success
     * @throws ApiError
     */
    public static getApiChatDeveloper({
id,
}: {
id: number,
}): CancelablePromise<IczpNet_Chat_Developers_Dtos_DeveloperDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/developer/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 开发者设置
     * @returns IczpNet_Chat_Developers_Dtos_DeveloperDto Success
     * @throws ApiError
     */
    public static postApiChatDeveloperSetConfig({
id,
token = '95fd7796cc15d9f81f3f79dbc090ab03fb2941ef',
encodingAesKey = 'GUhGDQKNcRpnp4XHQtnJY24MXWmMGV64KtahF3tjUQd',
postUrl = 'https://',
}: {
/**
 * 主建Id
 */
id: number,
/**
 * 开发者设置的Token
 */
token?: string,
/**
 * 开发者设置的EncodingAESKey
 */
encodingAesKey?: string,
/**
 * 开发者设置 的 Url
 */
postUrl?: string,
}): CancelablePromise<IczpNet_Chat_Developers_Dtos_DeveloperDto> {
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
            
        });
    }

    /**
     * 启用与关闭
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatDeveloperSetIsEnabled({
id,
isEnabled,
}: {
/**
 * 主建Id
 */
id: number,
isEnabled?: boolean,
}): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/{id}/set-is-enabled',
            path: {
                'id': id,
            },
            query: {
                'isEnabled': isEnabled,
            },
            
        });
    }

    /**
     * String转Base64
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatDeveloperStringToBase64({
input,
}: {
input?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/developer/string-to-base64',
            query: {
                'input': input,
            },
            
        });
    }

    /**
     * 验证签名
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatDeveloperVerifySignature({
signature,
token,
timeStamp,
nonce,
cipherText,
}: {
/**
 * 签名 signature
 */
signature?: string,
/**
 * 公众平台上，开发者设置的Token
 */
token?: string,
/**
 * 时间戳
 */
timeStamp?: string,
/**
 * 随机数
 */
nonce?: string,
/**
 * 密文
 */
cipherText?: string,
}): CancelablePromise<boolean> {
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
            
        });
    }

}
