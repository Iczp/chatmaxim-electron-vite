import { TextDto } from './TextDto';

/**
 * 系统命令（）
 */
export type CmdDto = TextDto & {
  /**
   * 执行的命令（需要与前端一致）
   */
  cmd?: string | null;

  /**
   * app:///pages/im/notice?id=123
   */
  url?: string | null;
};
