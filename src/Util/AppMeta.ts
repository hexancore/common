export interface AppMetaProps {
  env: EnvType;
  id: string;
  version: string;
  debug: boolean;
  logPretty: boolean;
  logSilent: boolean;
  ci: boolean;

  home?: string;
  envFilePath?: string;

  extra?: Record<string, any>;
}

export type EnvType = 'dev' | 'test' | 'prod';

export type AppMetaPropsProvider = () => AppMetaProps;

export class AppMeta implements AppMetaProps {
  private static instance: AppMeta;
  public static propsProvider: AppMetaPropsProvider;

  public readonly env: EnvType;
  public readonly id: string;
  public readonly version: string;
  public readonly debug: boolean;
  public readonly logPretty: boolean;
  public readonly logSilent: boolean;
  public readonly ci: boolean;

  public readonly home: string;
  public readonly envFilePath: string;

  public readonly extra: Record<string, any>;

  private constructor(private props: AppMetaProps) {

    this.env = props.env;
    this.id = props.id;
    this.version = props.version;
    this.debug = props.debug;
    this.logPretty = props.logPretty;
    this.logSilent = props.logSilent;
    this.ci = props.ci;

    this.home = props.home ?? '';
    this.envFilePath = props.envFilePath ?? '';

    this.extra = props.extra ?? {};
  }

  public static get(): AppMeta {
    if (AppMeta.instance === undefined) {
      if (AppMeta.propsProvider === undefined) {
        throw Error('AppMeta.instanceFactory is not sets before first get() call, check your code');
      }
      AppMeta.instance = new AppMeta(AppMeta.propsProvider());
    }

    return AppMeta.instance;
  }

  public getProps(): AppMetaProps {
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
}
