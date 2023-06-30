import axios from 'axios';
import { throttledGetDataFromApi } from './index';
import users from './__fixtures__/users.json';

jest.mock('lodash', () => {
  const originalModule = jest.requireActual<typeof import('lodash')>('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.create = jest.fn(() => mockedAxios);
  mockedAxios.get.mockImplementationOnce(() =>
    Promise.resolve({ data: users }),
  );
});

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/users');
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/users');
    expect(mockedAxios.get).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    mockedAxios.get.mockResolvedValueOnce(users);
    const result = await throttledGetDataFromApi('/users');
    expect(result).toEqual(users);
  });
});
