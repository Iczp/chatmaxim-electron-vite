import { BadgeDto } from './BadgeDto';
import { ChatObjectDto } from './ChatObjectDto';

export type BadgeDetialDto = BadgeDto & {
  owner?: ChatObjectDto;
};
