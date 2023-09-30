import axios, { AxiosError, AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpResponse } from '../../Http/HttpSupport';
import { AxiosHttpClient, HttpClient } from '../../Http';
import { R } from '@/Util';

export interface MockAdapterOptions {
  delayResponse?: number;
  onNoMatch?: 'passthrough' | 'throwException';
}

export class MockHttpClient extends MockAdapter {
  public constructor(public readonly client: HttpClient, axiosInstance: AxiosInstance, options?: MockAdapterOptions) {
    super(axiosInstance, options);
  }

  public static create(mockAdapterOptions?: MockAdapterOptions): MockHttpClient {
    const axiosInstance = axios.create();

    const i18n = {
      t: (key: string, context: Record<string, any>): string => {
        return `${key}:${JSON.stringify(context)}`;
      },
    };
    const client = AxiosHttpClient.create(
      {
        baseUrl: undefined,
        i18n: i18n,
      },
      axiosInstance,
    );

    return new MockHttpClient(client, axiosInstance, mockAdapterOptions);
  }

  public expectResponseResult(current: R<HttpResponse>, expected: R<HttpResponse>): void {
    if (current.isError() && expected.isSuccess()) {
      expect(current.e).toBe({});
    }

    if (current.isSuccess() && expected.isError()) {
      expect(current.v).toBe({});
    }

    if (current.isError()) {
      expect(current.e.type).toBe(expected.e.type);
      expect(current.e.code).toBe(expected.e.code);
      expect(current.e.data).toEqual(expected.e.data);

      expect(current.e.i18n).toBe(expected.e.i18n ?? expected.e.type);
      expect(current.e.message).toBe(expected.e.message);
      expect(current.e.error).toBeInstanceOf(AxiosError);
    } else {
      expect(current.v.data).toEqual(expected.v.data);
      //expect(current.v.headers.toJSON()).toEqual(expected.v.headers.toJSON());
    }
  }
}
