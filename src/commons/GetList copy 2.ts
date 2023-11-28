import { Ref, UnwrapNestedRefs, UnwrapRef, reactive, ref, toRaw, toRef, toValue, watch } from 'vue';
import { GetListInput, PagedResultDto } from '../apis/dtos';
import { CancelablePromise } from '../apis';
import { usePagedResult } from './usePagedResult';

export abstract class GetList<TInput extends GetListInput, TDto> {
  // public pagedResult;
  /** 是正在提交 @type {*} */
  public isPosting: Ref<boolean> = ref<boolean>(false);

  /** 是否到底了 @type {*} */
  public isEof: Ref<boolean> = ref<boolean>(false);

  public isError: Ref<boolean> = ref<boolean>(false);

  /** 数据 @type {*} */
  public items = ref<Array<TDto>>([]);

  /** 总数量@type {*} */
  public totalCount = ref<number | undefined>();

  public query: Ref<TInput | undefined> = ref<TInput | undefined>();

  public task: CancelablePromise<PagedResultDto<TDto>> | null = null;

  public service?: (input: TInput) => CancelablePromise<PagedResultDto<TDto>>;

  constructor(query: TInput) {
    const { isPosting, isEof, items, totalCount, isError } = usePagedResult<TDto>();

    // this.isEof = isEof;
    // this.isError = isError;
    // this.isPosting = isPosting;
    // this.items = items;
    // this.totalCount = totalCount;
    this.query.value = query;
    // this.task = null;
    // this.watch();
  }

  //   service(input: TInput): CancelablePromise<PagedResultDto<TDto>> {
  //     throw new Error('未实现task');
  //   }

  fetchData(query: TInput) {
    if (this.isEof.value || this.isPosting.value) {
      return;
    }
    query = query || toValue(this.query.value);
    console.log('fetchData', query);

    this.isPosting.value = true;
    this.task = this.service!(query);
    this.task
      .then(res => this.handleSuccess(query, res))
      .catch(err => this.handleError(query, err))
      .finally(() => (this.isPosting.value = false));
  }

  cancel() {
    this.task?.cancel();
  }

  handleSuccess(query: TInput, res: PagedResultDto<TDto>): void {
    this.totalCount.value = res.totalCount!;
    this.isEof.value = res.items?.length == 0;
    const _items = ref(this.formatItems(res.items!));
    this.items.value = query.skipCount ? this.items.value.concat(_items.value) : _items.value;
  }

  handleError(query: TInput, err: any): void {
    this.isError.value = true;
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
    this.items.value = [];
    this.isPosting.value = false;
    this.isEof.value = false;
    this.isError.value = false;
    this.query.value!.skipCount = 0;
  }

  /**
   * 下一页
   *
   * @memberof GetList
   */
  next() {
    this.isPosting.value = false;
    this.query.value!.skipCount = this.items.value.length;
  }

  watch(immediate: boolean = true) {
    console.log('watch start');
    watch(
      () => this.query.value,
      v => {
        console.log('watch this.query', v);

        this.fetchData(v!);
      },
      {
        immediate,
      },
    );
  }
}
