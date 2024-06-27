import { AppMeta } from '@/Util/AppMeta';
import '@/Test/Jest';

AppMeta.setProvider(() => {
  return {
    id: 'App',
    ci: false,
    env: 'test',
    debug: true,
    logPretty: true,
    logSilent: false,
    version: 'test',
  };
});


process.on('unhandledRejection', (err) => {
  fail(err);
});
