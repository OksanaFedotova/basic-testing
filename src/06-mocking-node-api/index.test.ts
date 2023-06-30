import { join } from 'path';
import path from 'path';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, 500);
    expect(setInterval).toHaveBeenLastCalledWith(callback, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    for (let i = 0; i < 3; i++) {
      doStuffByInterval(callback, 500);
    }
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(setInterval).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');
    const pathToFile = './test.txt';
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });
  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(await readFileAsynchronously('./test.txt')).toBeNull();
  });
  //about the test below I had a discussion:
  //https://stackoverflow.com/questions/76583018/mock-fs-readfile-with-typescript
  //at the moment I didn't find the way to mock fs.readFile without changing the function readFileAsynchronously
  //so fs.existsSync I didn't mock also, beacuse it's useless.
  test('should return file content if file exists', async () => {
    const pathToFile = './__fixtures__/test.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toEqual('Hello!');
  });
});
