/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volo_Abp_Http_Modeling_ApplicationApiDescriptionModel } from '../models/Volo_Abp_Http_Modeling_ApplicationApiDescriptionModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AbpApiDefinitionService {

    /**
     * @returns Volo_Abp_Http_Modeling_ApplicationApiDescriptionModel Success
     * @throws ApiError
     */
    public static getApiAbpApiDefinition({
includeTypes,
}: {
includeTypes?: boolean,
}): CancelablePromise<Volo_Abp_Http_Modeling_ApplicationApiDescriptionModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/abp/api-definition',
            query: {
                'IncludeTypes': includeTypes,
            },
            
        });
    }

}
