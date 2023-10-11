/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto } from './IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto';

export type IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto = {
    size?: number;
    messageType?: IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto.messageType;
    message?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto;
    sessionUnitId?: string;
    ownerId?: number | null;
    destinationId?: number | null;
    deviceId?: string | null;
    creationTime?: string;
};

export namespace IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto {

    export enum messageType {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
        '_5' = 5,
        '_6' = 6,
        '_7' = 7,
        '_8' = 8,
        '_9' = 9,
        '_10' = 10,
        '_11' = 11,
        '_12' = 12,
    }


}
