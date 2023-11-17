import queryString from "query-string";

export const addParamsToUrl = (url: string, params: {}): string => {
    const uris = url.split('?');
    const searchParams = queryString.parse(uris[1]);
    uris[1] = queryString.stringify({
      ...searchParams,
      ...params,
    });
    return uris.join('?');
  };
  