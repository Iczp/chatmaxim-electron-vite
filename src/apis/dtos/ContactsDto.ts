/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { ChatObjectDto } from './ChatObjectDto';

export type ContactsDto = {
    /**
     * 会话单元Id
     */
    id?: string;
    /**
     * 显示名称
     */
    displayName?: string | null;
    
    destination?: ChatObjectDto;
};
