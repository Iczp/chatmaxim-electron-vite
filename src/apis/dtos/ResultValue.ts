export interface ResultValue<T> {
  isPosting: boolean;
  isEof: boolean;
  totalCount: number;
  items: Array<T>;
}
