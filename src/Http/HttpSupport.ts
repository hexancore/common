import {
  AxiosHeaderValue,
  AxiosHeaders,
  AxiosResponse,
  AxiosResponseHeaders,
  GenericAbortSignal,
  RawAxiosResponseHeaders
} from 'axios';
import { AR, OKA } from '../Util';

export type HttpMethod = 'post' | 'put' | 'patch' | 'get' | 'delete' | 'head' | 'options';
export type HttpResponseType = 'text' | 'stream' | 'blob' | 'json' | 'arraybuffer' | 'document';

export type HttpHeaderValue = AxiosHeaderValue;

export type RawHttpResponseHeaders = RawAxiosResponseHeaders | AxiosResponseHeaders;

export class HttpHeaders extends AxiosHeaders {}

export type GAbortSignal = GenericAbortSignal;

export type RawHttpHeaders = {
  [key: string]: HttpHeaderValue;
};

/**
 * Marks raw form data for serialize
 */
export class RawFormData<D> {
  public constructor(public readonly data: D) {}

  public static create<D>(data: D): RawFormData<D> {
    return new this(data);
  }
}

export interface HttpRequestConfig<D = any> {
  url: string;
  method: HttpMethod;
  data?: D;
  headers?: RawHttpHeaders;
  query?: Record<string, any>;
  responseType?: HttpResponseType;

  withCredentials?: boolean;
  auth?: {
    username: string;
    password: string;
  };

  timeout?: number;
  signal?: GAbortSignal;
}

export type HttpResponseParser<D = any, OD = any> = (r: HttpResponse<D>) => AR<OD>;
export const DefaultHttpResponseParser: HttpResponseParser = (r: HttpResponse<any>): AR<any> => OKA(r.data);

OKA(DefaultHttpResponseParser({ data: 'te', statusCode: 200, headers: {} }));
export interface HttpResponse<D = any> {
  readonly data: D;
  readonly statusCode: number;
  readonly headers: RawHttpResponseHeaders;
}

export class AxiosHttpResponse<D = any> implements HttpResponse<D> {
  public constructor(private wrapped: AxiosResponse<D>) {}

  public get data(): D {
    return this.wrapped.data;
  }

  public get statusCode(): number {
    return this.wrapped.status;
  }

  public get headers(): RawHttpResponseHeaders {
    return (this.wrapped.headers as any).toJSON();
  }
}
