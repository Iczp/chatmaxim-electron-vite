/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto = {
    id?: string;
    creationTime?: string;
    autoId?: number;
    ownerId?: number | null;
    walletId?: string | null;
    businessId?: string | null;
    businessType?: IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto.businessType;
    availableAmountBeforeChange?: number;
    totalAmountBeforeChange?: number;
    lockAmountBeforeChange?: number;
    availableAmount?: number;
    totalAmount?: number;
    lockAmount?: number;
    amount?: number;
    description?: string | null;
};

export namespace IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto {

    export enum businessType {
        '_0' = 0,
        '_1' = 1,
        '_-1' = -1,
    }


}
