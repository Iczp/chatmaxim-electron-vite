/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
// import type { IczpNet_Chat_Cantacts_Dtos_ContactsDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Cantacts_Dtos_ContactsDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ContactsDto, ContactsGetListInput, PagedResultDto } from '../dtos';

export class ContactsService {

    /**
     * 通讯录列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Cantacts_Dtos_ContactsDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatContacts({
ownerId,
destinationObjectType,
tagId,
keyword,
maxResultCount,
skipCount,
sorting,
}: ContactsGetListInput): CancelablePromise<PagedResultDto<ContactsDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/contacts',
            query: {
                'OwnerId': ownerId,
                'DestinationObjectType': destinationObjectType,
                'TagId': tagId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

}
