import { Ref, ref } from 'vue';

export const usePagedResult = <T>() => {
  /** 是正在提交 @type {*} */
  const isPosting: Ref<boolean> = ref<boolean>(false);

  /** 是否到底了 @type {*} */
  const isEof: Ref<boolean> = ref<boolean>(false);

  /** 是否到顶了 @type {*} */
  const isBof: Ref<boolean> = ref<boolean>(false);

  const isError: Ref<boolean> = ref<boolean>(false);

  /** 数据 @type {*} */
  const items = ref<Array<T>>([]);

  /** 总数量@type {*} */
  const totalCount: Ref<number | undefined> = ref<number | undefined>();

  return { isPosting, isEof, items, totalCount, isError };
};
