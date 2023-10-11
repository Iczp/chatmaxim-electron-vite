/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto = {
    id?: string;
    appUserId?: string | null;
    ownerId?: number | null;
    walletId?: string | null;
    businessId?: string | null;
    businessType?: IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto.businessType;
    businessTypeName?: string | null;
    orderNo?: string | null;
    title?: string | null;
    description?: string | null;
    amount?: number;
    status?: IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto.status;
    expireTime?: string | null;
    isExpired?: boolean;
    isEnabled?: boolean;
};

export namespace IczpNet_Chat_WalletOrders_Dtos_WalletOrderDetailDto {

    export enum businessType {
        '_0' = 0,
        '_1' = 1,
        '_-1' = -1,
    }

    export enum status {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }


}
