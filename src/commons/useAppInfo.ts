import { ref } from 'vue';

import pkg from '../../package.json';

export const useAppInfo = () => {
    
  const appId = ref(import.meta.env.VITE_APP_ID);

  const appName = ref(import.meta.env.VITE_APP_NAME);

  const author = ref(import.meta.env.VITE_APP_AUTHOR);

  const websize = ref(import.meta.env.VITE_APP_WEBSIZE);

  const copyright = ref(import.meta.env.VITE_APP_COPYRIGHT);

  const version = ref(pkg.version);

  return { appId, appName, author, websize, version, copyright };
};
