import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ContactsDto, ContactsGetListInput, PagedResultDto } from '../dtos';

export class ContactsService {
  /**
   * 通讯录列表
   * @returns CancelablePromise<PagedResultDto<ContactsDto>>
   * @throws ApiError
   */
  public static getApiChatContacts(
    input: ContactsGetListInput,
  ): CancelablePromise<PagedResultDto<ContactsDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/contacts',
      query: {
        ...input,
      },
    });
  }
}
