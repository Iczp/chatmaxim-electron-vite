/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto } from '../models/Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AbpTenantService {
  /**
   * @returns Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto Success
   * @throws ApiError
   */
  public static getApiAbpMultiTenancyTenantsById({
    id,
  }: {
    id: string;
  }): CancelablePromise<Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/abp/multi-tenancy/tenants/by-id/{id}',
      path: {
        id: id,
      },
      
    });
  }

  /**
   * @returns Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto Success
   * @throws ApiError
   */
  public static getApiAbpMultiTenancyTenantsByName({
    name,
  }: {
    name: string;
  }): CancelablePromise<Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/abp/multi-tenancy/tenants/by-name/{name}',
      path: {
        name: name,
      },
      
    });
  }
}
