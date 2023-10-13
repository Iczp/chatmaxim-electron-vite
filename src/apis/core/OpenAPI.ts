/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { getLocalToken, getToken, isTokenUrl } from '../auth/TokenController';
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  AUTH_HOST: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN?: string | Resolver<string> | undefined;
  USERNAME?: string | Resolver<string> | undefined;
  PASSWORD?: string | Resolver<string> | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};

export const OpenAPI: OpenAPIConfig = {
  BASE: 'http://10.0.5.20:8044',
  AUTH_HOST: 'http://10.0.5.20:8043',
  VERSION: '1',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: undefined,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

// OpenAPI.TOKEN = async (options) => {
//   try {
//     console.warn('OpenAPI.TOKEN options', options);
//     if (isTokenUrl(options.url)) {
//       return '';
//     }
//     let token = await getToken();
//     let v = token?.access_token?.toString();
//     return v || '';
//   } catch (err) {
//     console.error(err);
//   }
//   return getLocalToken()?.access_token || '';
//   //   return 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkIyMTIyOTg4MDQ2ODM2NjFEQTRGNjY4QzY5RkYwREQxOUFFRkU5NUMiLCJ4NXQiOiJzaElwaUFSb05tSGFUMmFNYWY4TjBacnY2VnciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiIzNjBjZmVkYi1lOTJkLTMzMzEtMWZhZC0zYTA4NjM3MWUwZTQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWJwLmlvIiwicm9sZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6ImFkbWluIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiRmFsc2UiLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsImNoYXRfb2JqZWN0X2lkIjpbIjEzIiwiMTQiXSwiY2hhdF9vYmplY3RfY291bnQiOjIsIm9pX3Byc3QiOiJJTV9BcHAiLCJvaV9hdV9pZCI6ImQ2Y2JkODhlLWNmNWUtMWVhNC04NTMyLTNhMGUzNDliYWI4MSIsImNsaWVudF9pZCI6IklNX0FwcCIsIm9pX3Rrbl9pZCI6IjA2YjI4OTVkLTE1NDItZDVmMS1lZTFhLTNhMGUzNDliYWMxMCIsImF1ZCI6IklNIiwic2NvcGUiOiJJTSBvZmZsaW5lX2FjY2VzcyByb2xlcyBwcm9maWxlIHBob25lIGVtYWlsIGFkZHJlc3MiLCJqdGkiOiJkYmZkMDhhMi1hYzc2LTQwOGQtYjlmMi1iMTVlODVjMTI3ODQiLCJleHAiOjE2OTcxNzYxNzAsImlzcyI6Imh0dHA6Ly8xMC4wLjUuMjA6ODA0My8iLCJpYXQiOjE2OTcwODk3NzB9.aRwy8RW4HTD1uiSNO9YFjGjGZ49rWoNYi2R4k3G6m-pSlgFpfuQUWDjsoceAWyXnz8wQ96p02i8HKg_PAORS3TXF9rISKD4BckPkGJZoBRu2din4FIwrSG5_bNit6y4VM597mE4IugFjDAqW_T_dzJhTyoMFomg4CNKQuK9OMYfOlxS3OAiX-I3owd3xImcnts4n3r56rvA4WYI7XSVv2qkVz0d4SCnfRXIYk85KP_fQdv2cZyuZTH7pV4dULYGVOD-GYxShBbloqE5mqXJJRGMBw7ETs0D5rtvR3K_6XuIjcrlmUeZ4c4evZjl3fZevCN8v6zpR58OzPKShC0VnXg';
// };
