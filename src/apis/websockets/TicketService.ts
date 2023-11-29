import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ConnectionDto } from './ConnectionDto';

export class TicketService {
  public static generate({ requestBody }: { requestBody?: any }): CancelablePromise<ConnectionDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/app/ticket/generate',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
