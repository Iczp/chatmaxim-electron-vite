/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Articles_Dtos_ArticleCreateInput } from '../models/IczpNet_Chat_Articles_Dtos_ArticleCreateInput';
import type { IczpNet_Chat_Articles_Dtos_ArticleDetailDto } from '../models/IczpNet_Chat_Articles_Dtos_ArticleDetailDto';
// import type { IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Articles_Dtos_ArticleUpdateInput } from '../models/IczpNet_Chat_Articles_Dtos_ArticleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArticleService {
  /**
   * 新增
   * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
   * @throws ApiError
   */
  public static postApiChatArticle({
    requestBody,
  }: {
    requestBody?: IczpNet_Chat_Articles_Dtos_ArticleCreateInput;
  }): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/article',
      body: requestBody,
      mediaType: 'application/json',
      
    });
  }

  /**
   * 获取列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Articles_Dtos_ArticleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatArticle({
    ownerId,
    type,
    minCount,
    maxCount,
    isForbiddenAll,
    memberOwnerId,
    forbiddenMemberOwnerId,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: {
    /**
     * 群主
     */
    ownerId?: string;
    type?: 0;
    minCount?: number;
    maxCount?: number;
    /**
     * 是否全体禁言
     */
    isForbiddenAll?: boolean;
    /**
     * 成员所在的群(我加入的群)
     */
    memberOwnerId?: string;
    /**
     * 成员被禁言的群
     */
    forbiddenMemberOwnerId?: string;
    /**
     * 关键字(支持拼音)
     */
    keyword?: string;
    /**
     * 显示数量
     */
    maxResultCount?: number;
    /**
     * 跳过数量
     */
    skipCount?: number;
    /**
     * 排序
     */
    sorting?: string;
  }): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/article',
      query: {
        OwnerId: ownerId,
        Type: type,
        MinCount: minCount,
        MaxCount: maxCount,
        IsForbiddenAll: isForbiddenAll,
        MemberOwnerId: memberOwnerId,
        ForbiddenMemberOwnerId: forbiddenMemberOwnerId,
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
  public static postApiChatArticleDelete({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/article/{id}/delete',
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
  public static postApiChatArticleDeleteMany({
    requestBody,
  }: {
    /**
     * 主键Id[多个]
     */
    requestBody?: Array<string>;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/article/delete-many',
      body: requestBody,
      mediaType: 'application/json',
      
    });
  }

  /**
   * 获取一条记录 Get
   * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
   * @throws ApiError
   */
  public static getApiChatArticle1({
    id,
  }: {
    /**
     * 主键Id
     */
    id: string;
  }): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/article/{id}',
      path: {
        id: id,
      },
      
    });
  }

  /**
   * 获取多条数据
   * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
   * @throws ApiError
   */
  public static getApiChatArticleMany({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<string>;
  }): CancelablePromise<Array<IczpNet_Chat_Articles_Dtos_ArticleDetailDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/article/many',
      query: {
        idList: idList,
      },
      
    });
  }

  /**
   * 修改
   * @returns IczpNet_Chat_Articles_Dtos_ArticleDetailDto Success
   * @throws ApiError
   */
  public static postApiChatArticleUpdate({
    id,
    requestBody,
  }: {
    /**
     * 主键Id
     */
    id: string;
    requestBody?: IczpNet_Chat_Articles_Dtos_ArticleUpdateInput;
  }): CancelablePromise<IczpNet_Chat_Articles_Dtos_ArticleDetailDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/article/{id}/update',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      
    });
  }
}
