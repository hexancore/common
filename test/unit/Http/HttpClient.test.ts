import { HttpClient } from '@/Http/HttpClient';
import { MockHttpClient } from '@/Test/Http/MockHttpClient';
import { AxiosError } from 'axios';

describe('HttpClient', () => {
  let clientMock: MockHttpClient;
  let client: HttpClient;
  beforeEach(() => {
    clientMock = MockHttpClient.create();
    client = clientMock.client;
  });

  test('request', async () => {
    clientMock.onGet('test').reply(200, 'test', { 'X-Custom-Header': '10' });
    const current = await client.send({
      method: 'get',
      url: 'test',
    });

    const res = current.v;
    expect(res.data).toEqual('test');
    expect(res.statusCode).toEqual(200);
    expect(res.headers).toEqual({ 'X-Custom-Header': '10' });
  });

  test('request when error', async () => {
    clientMock.onGet('test').reply(400, { type: 'test.error', data: { field: 'test' } });
    const current = await client.send({
      method: 'get',
      url: 'test',
    });

    expect(current).toMatchAppError({
      type: 'test.error',
      data: { field: 'test' },
      code: 400,
      i18n: 'test.error',
      message: 'test.error:' + JSON.stringify({ field: 'test' }),
      error: expect.any(AxiosError),
    });
  });
});
