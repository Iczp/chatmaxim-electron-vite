/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Robots_Dtos_RobotCreateInput } from '../models/IczpNet_Chat_Robots_Dtos_RobotCreateInput';
import type { IczpNet_Chat_Robots_Dtos_RobotDto } from '../models/IczpNet_Chat_Robots_Dtos_RobotDto';
import type { IczpNet_Chat_Robots_Dtos_RobotUpdateInput } from '../models/IczpNet_Chat_Robots_Dtos_RobotUpdateInput';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RobotManagementService {

    /**
     * @param requestBody 
     * @returns IczpNet_Chat_Robots_Dtos_RobotDto Success
     * @throws ApiError
     */
    public static postApiChatRobotManagement(
requestBody?: IczpNet_Chat_Robots_Dtos_RobotCreateInput,
): CancelablePromise<IczpNet_Chat_Robots_Dtos_RobotDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/robot-management',
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
     * @param id 
     * @param requestBody 
     * @returns IczpNet_Chat_Robots_Dtos_RobotDto Success
     * @throws ApiError
     */
    public static postApiChatRobotManagementUpdate(
id: number,
requestBody?: IczpNet_Chat_Robots_Dtos_RobotUpdateInput,
): CancelablePromise<IczpNet_Chat_Robots_Dtos_RobotDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/robot-management/{id}/update',
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
