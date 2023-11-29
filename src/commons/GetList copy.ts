import { Ref, UnwrapNestedRefs, reactive, ref, toRaw, watch } from 'vue';
import { GetListInput, PagedResultDto } from '../apis/dtos';
import { CancelablePromise } from '../apis';
import { usePagedResult } from './usePagedResult';

export abstract class GetList<TInput extends GetListInput, TDto> {
  // public pagedResult;
  /** 是正在提交 @type {*} */
  public isPosting: boolean = false;

  /** 是否到底了 @type {*} */
  public isEof: boolean = false;

  public isError: boolean = false;

  /** 数据 @type {*} */
  public items: Array<TDto> = [];

  /** 总数量@type {*} */
  public totalCount: number | undefined;

  public query: TInput;

  public task: CancelablePromise<PagedResultDto<TDto>> | null = null;

  public service?: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;

  constructor(query: TInput) {
    // const { isPosting, isEof, items, totalCount, isError } = usePagedResult<TDto>();

    // this.isEof = isEof;
    // this.isError = isError;
    // this.isPosting = isPosting;
    // this.items = items;
    // this.totalCount = totalCount;
    this.query = query;
    // this.task = null;
    // this.watch();
  }

  //   service(input: TInput): CancelablePromise<PagedResultDto<TDto>> {
  //     throw new Error('未实现task');
  //   }

  fetchData(query: TInput) {
    if (this.isEof || this.isPosting) {
      return;
    }
    query = query || toRaw(this.query);
    this.isPosting = true;
    this.task = this.service!(query);
    this.task
      .then(res => this.handleSuccess(query, res))
      .catch(err => this.handleError(query, err));
  }

  cancel() {
    this.task?.cancel();
  }

  handleSuccess(query: TInput, res: PagedResultDto<TDto>): void {
    this.totalCount = res.totalCount!;
    this.isEof = res.items?.length == 0;
    const _items = this.formatItems(res.items!);
    this.items = query.skipCount ? this.items.concat(_items) : _items;
  }

  handleError(query: TInput, err: any): void {
    this.isError = true;
    console.error(err);
  }

  formatItems(items: Array<TDto>): Array<TDto> {
    return items;
  }

  /**
   * 刷新
   *
   * @memberof GetList
   */
  refresh() {
    this.items = [];
    this.isPosting = false;
    this.isEof = false;
    this.isError = false;
    this.query.skipCount = 0;
  }

  /**
   * 下一页
   *
   * @memberof GetList
   */
  next() {
    this.isPosting = false;
    this.query.skipCount = this.items.length;
  }

  watch(immediate: boolean = true) {
    watch(
      () => this.query,
      v => {
        this.fetchData(v);
      },
      {
        immediate,
      },
    );
  }
}
