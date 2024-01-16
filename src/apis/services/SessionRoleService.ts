/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionGrantValue } from '../models/PermissionGrantValue';
import type { SessionRolePostInput } from '../models/SessionRolePostInput';
import type { SessionRoleDetailDto } from '../models/SessionRoleDetailDto';
// import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GetListInput, PagedResultDto } from '../dtos';
import { SessionRoleGetListInput } from '../models/SessionRoleGetListInput';

export class SessionRoleService {
  /**
   * 新增
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
   * @throws ApiError
   */
  public static postApiChatSessionRole({
    requestBody,
  }: {
    requestBody?: SessionRolePostInput;
  }): CancelablePromise<SessionRoleDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-role',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 获取列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionRoleList({
    sessionId,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: SessionRoleGetListInput): CancelablePromise<PagedResultDto<SessionRoleDetailDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-role',
      query: {
        SessionId: sessionId,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }

  /**
   * 删除一条数据
   * @returns any Success
   * @throws ApiError
   */
  public static postApiChatSessionRoleDelete({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-role/{id}/delete',
      path: {
        id: id,
      },
    });
  }

  /**
   * 删除多条数据
   * @returns any Success
   * @throws ApiError
   */
  public static postApiChatSessionRoleDeleteMany({
    requestBody,
  }: {
    /**
     * 主键Id[多个]
     */
    requestBody?: Array<string>;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-role/delete-many',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 获取一条记录 Get
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
   * @throws ApiError
   */
  public static getApiChatSessionRole1({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<SessionRoleDetailDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-role/{id}',
      path: {
        id: id,
      },
    });
  }

  /**
   * 获取多条数据
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
   * @throws ApiError
   */
  public static getApiChatSessionRoleMany({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<string>;
  }): CancelablePromise<Array<SessionRoleDetailDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-role/many',
      query: {
        idList: idList,
      },
    });
  }

  /**
   * 获取角色权限
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto Success
   * @throws ApiError
   */
  public static getApiChatSessionRolePermissions({
    id,
  }: {
    /**
     * 主建Id
     */
    id: string;
  }): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-role/{id}/permissions',
      path: {
        id: id,
      },
    });
  }

  /**
   * 授予角色所有权限
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto Success
   * @throws ApiError
   */
  public static postApiChatSessionRoleSetAllPermissions({
    id,
    requestBody,
  }: {
    /**
     * 主建Id
     */
    id: string;
    /**
     * 授予值
     */
    requestBody?: PermissionGrantValue;
  }): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-role/{id}/set-all-permissions',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 修改
   * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
   * @throws ApiError
   */
  public static postApiChatSessionRoleUpdate({
    id,
    requestBody,
  }: {
    /**
     * 主键Id
     */
    id: string;
    requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput;
  }): CancelablePromise<SessionRoleDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-role/{id}/update',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
