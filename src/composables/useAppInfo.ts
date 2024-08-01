import { ref } from 'vue';

import pkg from '../../package.json';
import { env } from '../env';

export const useAppInfo = () => {
  const appId = ref(env.app_id);

  const appName = ref(env.app_name);

  const author = ref(env.author);

  const websize = ref(env.websize);

  const copyright = ref(env.copyright);

  const version = ref(pkg.version);

  return { appId, appName, author, websize, version, copyright };
};
