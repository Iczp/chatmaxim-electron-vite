export const env: {
  /**
   *
   *
   * @type {string}
   */
  app_id: string;

  /**
   *
   *
   * @type {string}
   */
  app_name: string;

  /**
   *
   *
   * @type {string}
   */
  url_scheme: string;

  /**
   *
   *
   * @type {string}
   */
  token_key: string;

  /**
   *
   *
   * @type {string}
   */
  client_id: string;

  /**
   *
   *
   * @type {(string | undefined)}
   */
  client_secret: string | undefined;
  /**
   *
   *
   * @type {string}
   */
  base_url: string;

  /**
   *
   *
   * @type {string}
   */
  auth_host: string;

  /**
   *
   *
   * @type {string}
   */
  author: string;

  /**
   *
   *
   * @type {string}
   */
  websize: string;

  /**
   *
   *
   * @type {string}
   */
  copyright: string;
} = {
  app_id: import.meta.env.VITE_APP_ID,

  app_name: import.meta.env.VITE_APP_NAME,

  url_scheme: import.meta.env.VITE_APP_URL_SCHEME,

  token_key: import.meta.env.VITE_APP_TOKEN_KEY,

  client_id: import.meta.env.VITE_APP_CLIENT_ID,

  client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,

  base_url: import.meta.env.VITE_APP_BASEURL,

  auth_host: import.meta.env.VITE_APP_AUTH_HOST,

  author: import.meta.env.VITE_APP_AUTHOR,

  websize: import.meta.env.VITE_APP_WEBSIZE,

  copyright: import.meta.env.copyright,
};