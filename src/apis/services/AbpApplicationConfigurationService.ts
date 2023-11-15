/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto } from '../models/Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AbpApplicationConfigurationService {

    /**
     * @returns Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto Success
     * @throws ApiError
     */
    public static getApiAbpApplicationConfiguration({
includeLocalizationResources,
}: {
includeLocalizationResources?: boolean,
}): CancelablePromise<Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/abp/application-configuration',
            query: {
                'IncludeLocalizationResources': includeLocalizationResources,
            },
            
        });
    }

}
