import { LogicError } from './Error';
import { getEnvOrError as getRequiredEnv, parseBoolean } from './functions';

export interface AppMetaProps<ET extends Record<string, any> = Record<string, any>> {
  env: EnvType;
  id: string;
  version: string;
  debug: boolean;
  logPretty: boolean;
  logSilent: boolean;
  ci: boolean;
  extra?: ET;
}

export type EnvType = 'dev' | 'test' | 'prod';


export type AppMetaProvider = () => AppMetaProps;

export class AppMeta<ET extends Record<string, any> = Record<string, any>> implements AppMetaProps {
  protected static instance: AppMeta;
  protected static provider?: AppMetaProvider;

  public static setProvider(p: AppMetaProvider): void {
    if (this.provider === undefined) {
      this.provider = p;
    } else {
      if (!this.get().isTest()) {
        throw new LogicError('AppMeta.provider can be sets once');
      }
    }
  }

  public readonly env: EnvType;
  public readonly id: string;
  public readonly version: string;
  public readonly debug: boolean;
  public readonly logPretty: boolean;
  public readonly logSilent: boolean;
  public readonly ci: boolean;

  public readonly extra: Readonly<Record<string, any>>;

  private constructor(private props: AppMetaProps<ET>) {
    this.env = props.env;
    this.id = props.id;
    this.version = props.version;
    this.debug = props.debug;
    this.logPretty = props.logPretty;
    this.logSilent = props.logSilent;
    this.ci = props.ci;

    this.extra = props.extra ?? {};
  }

  public static get<ET extends Record<string, any> = Record<string, any>>(): AppMeta<ET> {
    if (AppMeta.instance === undefined) {
      if (AppMeta.provider === undefined) {
        throw Error('AppMeta.instanceFactory is not sets before first get() call, check your code');
      }
      AppMeta.instance = new AppMeta(AppMeta.provider());
    }

    return AppMeta.instance as AppMeta<ET>;
  }

  public getProps(): AppMetaProps<ET> {
    return this.props;
  }

  public isDev(): boolean {
    return this.env === 'dev';
  }

  public isTest(): boolean {
    return this.env === 'test';
  }

  public isProd(): boolean {
    return this.env === 'prod';
  }

  public static checkEnvIsValid(env: string, errorMessage: string): void {
    if (['dev', 'test', 'prod'].indexOf(env) === -1) {
      throw new Error(errorMessage);
    }
  }
}

export const EnvAppMetaProvider: AppMetaProvider = (): AppMetaProps => {
  const env = getRequiredEnv('APP_ENV');
  AppMeta.checkEnvIsValid(env, 'Invalid env.APP_ENV: ' + env);
  const isProd = env === 'prod';

  const props = {
    env: env as EnvType,
    id: getRequiredEnv('APP_ID'),
    version: isProd ? getRequiredEnv('APP_VERSION') : 'latest',
    debug: parseBoolean(process.env.APP_DEBUG, isProd ? false : true),
    logPretty: parseBoolean(process.env.APP_LOG_PRETTY, !isProd),
    logSilent: parseBoolean(process.env.APP_LOG_SILENT),
    ci: parseBoolean(process.env.CI),
    extra: {},
  };

  return props;
};
