import { IdDto } from './IdDto';

export type EntryNameDto = IdDto & {
  /**
   *
   *
   * @type {string}
   */
  parentId?: string;
  /**
   *
   *
   * @type {string}
   */
  name?: string;
  /**
   * Text | Number | Textarea | Radio | Checkbox | Select | Switch | Slider | Upload | Date | Time
   *
   * @type {string}
   */
  inputType?: string;
  /**
   *
   *
   * @type {number}
   */
  sorting?: number;
  /**
   *
   *
   * @type {string}
   */
  code?: string;
  /**
   *
   *
   * @type {string}
   */
  regex?: string;
  /**
   *
   *
   * @type {number}
   */
  maxLenth?: number;
  /**
   *
   *
   * @type {number}
   */
  minLenth?: number;
  /**
   *
   *
   * @type {number}
   */
  maxCount?: number;
  /**
   *
   *
   * @type {number}
   */
  minCount?: number;
  /**
   *
   *
   * @type {boolean}
   */
  isUniqued?: boolean;
  /**
   *
   *
   * @type {boolean}
   */
  isRequired?: boolean;
  /**
   *
   *
   * @type {boolean}
   */
  isStatic?: boolean;
  /**
   *
   *
   * @type {boolean}
   */
  isPublic?: boolean;
  /**
   *
   *
   * @type {string}
   */
  description?: string;
  /**
   *
   *
   * @type {string}
   */
  errorMessage?: string;

  /**
   *
   *
   * @type {string}
   */
  help?: string;
};
