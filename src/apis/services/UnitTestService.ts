/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UnitTestService {

    /**
     * @param count 
     * @param minValue 
     * @param maxValue 
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestGenerateInt(
count?: number,
minValue?: number,
maxValue?: number,
): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/generate-int',
            query: {
                'count': count,
                'minValue': minValue,
                'maxValue': maxValue,
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
     * @param url 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestHttpRequest(
url?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/http-request',
            query: {
                'url': url,
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
     * @param v 
     * @param length 
     * @returns string Success
     * @throws ApiError
     */
    public static getApiChatUnitTestIntToString(
v?: number,
length: number = 36,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/unit-test/int-to-string',
            query: {
                'v': v,
                'length': length,
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
     * @param ownerId 
     * @param destinationId 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdGenerate(
ownerId?: number,
destinationId?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-generate',
            query: {
                'ownerId': ownerId,
                'destinationId': destinationId,
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
     * @param count 
     * @param maxValue 
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdGenerateByRandom(
count: number = 50,
maxValue: number = 123456,
): CancelablePromise<Record<string, Array<number>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-generate-by-random',
            query: {
                'count': count,
                'maxValue': maxValue,
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
     * @param sessionUnitId 
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdIsVerified(
sessionUnitId: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-is-verified/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
     * @param sessionUnitId 
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdResolving(
sessionUnitId: string,
): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-resolving/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSetSessionLastMessage(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/set-session-last-message',
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
     * @param count 
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSetSessionUnitKey(
count: number = 1000,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/set-session-unit-key',
            query: {
                'count': count,
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
     * @param v 
     * @param length 
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatUnitTestStringToInt(
v?: string,
length: number = 36,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/unit-test/string-to-int',
            query: {
                'v': v,
                'length': length,
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
     * @param text 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestTextSegmenter(
text?: string,
): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/text-segmenter',
            query: {
                'text': text,
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
     * @param template 
     * @param requestBody 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestTextTemplate(
template?: string,
requestBody?: Record<string, any>,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/text-template',
            query: {
                'template': template,
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
