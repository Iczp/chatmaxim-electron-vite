import { EditorTypeEnums } from '../../enums/EditorTypeEnums';

/**
 * HTML消息
 */
export type HtmlContentDto = {
  id?: string | null;
  /**
   * 编辑器类型
   */
  editorType?: EditorTypeEnums;
  /**
   * 文本内容
   */
  title?: string | null;
  /**
   * 内容
   */
  content?: string | null;
  /**
   * 原始地址
   */
  originalUrl?: string | null;
};
