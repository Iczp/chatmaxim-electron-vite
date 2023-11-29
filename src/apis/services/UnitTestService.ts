/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UnitTestService {

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestGenerateInt({
count,
minValue,
maxValue,
}: {
count?: number,
minValue?: number,
maxValue?: number,
}): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/generate-int',
            query: {
                'count': count,
                'minValue': minValue,
                'maxValue': maxValue,
            },
            
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestHttpRequest({
url,
}: {
url?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/http-request',
            query: {
                'url': url,
            },
            
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static getApiChatUnitTestIntToString({
v,
length = 36,
}: {
v?: number,
length?: number,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/unit-test/int-to-string',
            query: {
                'v': v,
                'length': length,
            },
            
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdGenerate({
ownerId,
destinationId,
}: {
ownerId?: number,
destinationId?: number,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-generate',
            query: {
                'ownerId': ownerId,
                'destinationId': destinationId,
            },
            
        });
    }

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdGenerateByRandom({
count = 50,
maxValue = 123456,
}: {
count?: number,
maxValue?: number,
}): CancelablePromise<Record<string, Array<number>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-generate-by-random',
            query: {
                'count': count,
                'maxValue': maxValue,
            },
            
        });
    }

    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdIsVerified({
sessionUnitId,
}: {
sessionUnitId: string,
}): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-is-verified/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            
        });
    }

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSessionUnitIdResolving({
sessionUnitId,
}: {
sessionUnitId: string,
}): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/session-unit-id-resolving/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
            
        });
    }

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatUnitTestSetSessionUnitKey({
count = 1000,
}: {
count?: number,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/set-session-unit-key',
            query: {
                'count': count,
            },
            
        });
    }

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatUnitTestStringToInt({
v,
length = 36,
}: {
v?: string,
length?: number,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/unit-test/string-to-int',
            query: {
                'v': v,
                'length': length,
            },
            
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestTextSegmenter({
text,
}: {
text?: string,
}): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/text-segmenter',
            query: {
                'text': text,
            },
            
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatUnitTestTextTemplate({
template,
requestBody,
}: {
template?: string,
requestBody?: Record<string, any>,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/unit-test/text-template',
            query: {
                'template': template,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}
