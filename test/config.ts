import { AppMeta } from '@/Util/AppMeta';

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
