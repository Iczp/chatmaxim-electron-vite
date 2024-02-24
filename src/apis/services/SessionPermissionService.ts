/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto';
import type { PermissionGrantValue } from '../models/PermissionGrantValue';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GetListInput, IdDto, PagedResultDto } from '../dtos';
import { SessionPermissionDefinitionDetailDto } from '../models/SessionPermissionDefinitionDetailDto';
import { SessionPermissionGrantedDto } from '../models/SessionPermissionGrantedDto';

export class SessionPermissionService {
  /**
   * 获取会话角色权限
   * @returns IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue Success
   * @throws ApiError
   */
  public static getApiChatSessionPermissionGrantedBySessionRole({
    sessionRoleId,
  }: {
    /**
     * 会话角色Id
     */
    sessionRoleId: string;
  }): CancelablePromise<Record<string, PermissionGrantValue>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-permission/granted-by-session-role/{sessionRoleId}',
      path: {
        sessionRoleId: sessionRoleId,
      },
    });
  }

  /**
   * 获取授予权限的会话单元
   * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto Success
   * @throws ApiError
   */
  public static getApiChatSessionPermissionGrantedBySessionUnit({
    permissionDefinitionId,
    sessionUnitId,
  }: {
    /**
     * 权限Id
     */
    permissionDefinitionId?: string;
    /**
     * 会话单元Id
     */
    sessionUnitId?: string;
  }): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-permission/granted-by-session-unit',
      query: {
        permissionDefinitionId: permissionDefinitionId,
        sessionUnitId: sessionUnitId,
      },
    });
  }

  /**
   * 授予会话角色权限
   * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto Success
   * @throws ApiError
   */
  public static postApiChatSessionPermissionGrantBySessionRole({
    definitionId,
    sessionRoleId,
    requestBody,
  }: {
    /**
     * 权限Id
     */
    definitionId?: string;
    /**
     * 角色Id
     */
    sessionRoleId?: string;
    /**
     * 授予值
     */
    requestBody?: PermissionGrantValue;
  }): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-permission/grant-by-session-role',
      query: {
        definitionId: definitionId,
        sessionRoleId: sessionRoleId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 授予会话单元权限
   * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto Success
   * @throws ApiError
   */
  public static postApiChatSessionPermissionGrantBySessionUnit({
    definitionId,
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 权限Id
     */
    definitionId?: string;
    /**
     * 会话单元
     */
    sessionUnitId?: string;
    /**
     * 授予值
     */
    requestBody?: PermissionGrantValue;
  }): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-permission/grant-by-session-unit',
      query: {
        definitionId: definitionId,
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取列表
   * @returns
   * @throws ApiError
   */
  public static getApiChatSessionPermissionGrantedBySessionUnitList({
    id,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: IdDto & GetListInput): CancelablePromise<PagedResultDto<SessionPermissionGrantedDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-permission/granted-by-session-unit/{id}',
      path: {
        id: id,
      },
      query: {
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }
}
