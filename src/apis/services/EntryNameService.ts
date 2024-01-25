/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_AbpTrees_TreeInfo_1 } from '../models/IczpNet_AbpTrees_TreeInfo_1';
// import type { IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto';
// import type { IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput';
// import type { System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_ } from '../models/System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { EntryNameDto, GetListInput, PagedResultDto } from '../dtos';
import { EntryNameGetListInput } from '../dtos/EntryNameGetListInput';

export class EntryNameService {
  /**
   * 新增
   * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
   * @throws ApiError
   */
  public static postApiChatEntryName({
    requestBody,
  }: {
    requestBody?: IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput;
  }): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/entry-name',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatEntryNameList({
    isChoice,
    isUniqued,
    isRequired,
    isStatic,
    isPublic,
    isEnabledParentId = false,
    parentId,
    depthList,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: EntryNameGetListInput): CancelablePromise<PagedResultDto<EntryNameDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name',
      query: {
        IsChoice: isChoice,
        IsUniqued: isUniqued,
        IsRequired: isRequired,
        IsStatic: isStatic,
        IsPublic: isPublic,
        IsEnabledParentId: isEnabledParentId,
        ParentId: parentId,
        DepthList: depthList,
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
  public static postApiChatEntryNameDelete({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/entry-name/{id}/delete',
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
  public static postApiChatEntryNameDeleteMany({
    requestBody,
  }: {
    /**
     * 主键Id[多个]
     */
    requestBody?: Array<string>;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/entry-name/delete-many',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 获取一条数据
   * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
   * @throws ApiError
   */
  public static getApiChatEntryName1({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name/{id}',
      path: {
        id: id,
      },
    });
  }

  /**
   * 列表(缓存)
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatEntryNameByCache({
    isEnabledParentId = false,
    depthList,
    parentId,
    keyword,
    sorting,
    skipCount,
    maxResultCount,
  }: {
    isEnabledParentId?: boolean;
    depthList?: Array<number>;
    parentId?: string;
    keyword?: string;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name/by-cache',
      query: {
        IsEnabledParentId: isEnabledParentId,
        DepthList: depthList,
        ParentId: parentId,
        Keyword: keyword,
        Sorting: sorting,
        SkipCount: skipCount,
        MaxResultCount: maxResultCount,
      },
    });
  }

  /**
   * 获取一条数据(缓存)
   * @returns IczpNet_AbpTrees_TreeInfo_1<System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_> Success
   * @throws ApiError
   */
  public static getApiChatEntryNameItemByCache({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<IczpNet_AbpTrees_TreeInfo_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name/{id}/item-by-cache',
      path: {
        id: id,
      },
    });
  }

  /**
   * 获取多条数据(缓存)
   * @returns IczpNet_AbpTrees_TreeInfo_1<System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_> Success
   * @throws ApiError
   */
  public static getApiChatEntryNameManayByCache({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<string>;
  }): CancelablePromise<Array<IczpNet_AbpTrees_TreeInfo_1>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name/manay-by-cache',
      query: {
        idList: idList,
      },
    });
  }

  /**
   * 获取多条数据
   * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
   * @throws ApiError
   */
  public static getApiChatEntryNameMany({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<string>;
  }): CancelablePromise<Array<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/entry-name/many',
      query: {
        idList: idList,
      },
    });
  }

  /**
   * 修复数据（fullPath,fullName,childrenCount,depth等）
   * @returns string Success
   * @throws ApiError
   */
  public static postApiChatEntryNameRepairData({
    maxResultCount = 100,
    skinCount,
  }: {
    /**
     * 每次修复最大数量（过多可能导致数据库超时）
     */
    maxResultCount?: number;
    /**
     * 跳过数量
     */
    skinCount?: number;
  }): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/entry-name/repair-data',
      query: {
        maxResultCount: maxResultCount,
        skinCount: skinCount,
      },
    });
  }

  /**
   * 修改
   * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
   * @throws ApiError
   */
  public static postApiChatEntryNameUpdate({
    id,
    requestBody,
  }: {
    /**
     * 主键Id
     */
    id: string;
    requestBody?: IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput;
  }): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/entry-name/{id}/update',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
