import { AxiosError } from "axios";
import { TokenDto } from "./TokenDto";
import { ApiError } from "../../core/ApiError";

export type LoginResult = {
  /**
   *
   *
   * @type {string}
   */
  message: string;

  /**
   *
   *
   * @type {boolean}
   */
  success: boolean;

  /**
   *
   *
   * @type {*}
   */
  detail?: ApiError| TokenDto | any;
};
