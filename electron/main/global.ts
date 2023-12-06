export interface GlobalState {
  isAppQuitting?: boolean;
}

export const globalState: GlobalState = {
  isAppQuitting: false,
};
