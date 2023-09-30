import axios, { AxiosError, AxiosInstance } from 'axios';
import { AxiosHttpResponse, HttpRequestConfig, HttpResponse, RawFormData } from './HttpSupport';
import { AppError, AR, P, AppErrorProps, UNKNOWN_ERROR_TYPE, AppErrorCode } from '../Util';

export interface I18nHttpClient {
  t(key: string, context?: Record<string, any>): string;
}

export interface HttpClientOptions {
  baseUrl?: string;
  i18n: I18nHttpClient;
}

export interface HttpClient {
  send(options: HttpRequestConfig): AR<HttpResponse>;
}

export class AxiosHttpClient implements HttpClient {
  private errorMapper: (error) => AppError;
  private axios: AxiosInstance;

  public constructor(private options: HttpClientOptions, axiosInstance: AxiosInstance) {
    this.errorMapper = this.createErrorMapper();
    this.axios = axiosInstance;
  }

  public static create(options: HttpClientOptions, axiosInstance?: AxiosInstance): HttpClient {
    if (!axiosInstance) {
      axiosInstance = axios.create({
        baseURL: options.baseUrl ?? undefined,
      });
    }

    return new AxiosHttpClient(options, axiosInstance);
  }

  public send(req: HttpRequestConfig): AR<HttpResponse> {
    this.prepareRequest(req);
    return P(this.axios.request(req), this.errorMapper).map((r) => new AxiosHttpResponse(r));
  }

  protected prepareRequest(req: HttpRequestConfig): void {
    if (req.data instanceof RawFormData) {
      if (!req.headers) {
        req.headers = {};
      }
      req.headers['Content-Type'] = 'multipart/form-data';
    }
  }

  protected createErrorMapper(): any {
    return ((e: AxiosError) => {
      const appError: AppErrorProps = {
        type: UNKNOWN_ERROR_TYPE,
        code: 999,
        error: e,
      };

      if (e.response) {
        const responseData = (e.response.data ?? {}) as { type: string; code: number; i18n?: string; data?: any };
        appError.type = responseData.type ?? UNKNOWN_ERROR_TYPE;
        appError.code = responseData.code ?? e.response.status;
        appError.data = responseData.data ?? null;

        if (appError.type === UNKNOWN_ERROR_TYPE && appError.code === AppErrorCode.NOT_FOUND) {
          appError.type = 'core.http_client.response.not_found';
          appError.data = { url: e.config.url, method: e.config.method };
        }

        appError.i18n = responseData.i18n ?? appError.type;
      }

      appError.message = this.options.i18n.t(appError.i18n, appError.data ?? {});

      return new AppError(appError);
    }).bind(this);
  }
}
