/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_Locations_MediaItem } from './IczpNet_Chat_Locations_MediaItem';
import type { IczpNet_Chat_Locations_UserLocationCacheItem } from './IczpNet_Chat_Locations_UserLocationCacheItem';

/**
 * MediaLocation
 */
export type IczpNet_Chat_Locations_MediaLocation = {
    media?: IczpNet_Chat_Locations_MediaItem;
    /**
     * UserLocationList
     */
    userLocationList?: Array<IczpNet_Chat_Locations_UserLocationCacheItem> | null;
};
