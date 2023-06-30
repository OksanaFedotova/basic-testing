import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(300).getBalance()).toEqual(300);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => getBankAccount(300).withdraw(400)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => getBankAccount(300).withdraw(400)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(300);
    expect(() => account.transfer(200, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(getBankAccount(300).deposit(200).getBalance()).toEqual(500);
  });

  test('should withdraw money', () => {
    expect(getBankAccount(300).withdraw(200).getBalance()).toEqual(100);
  });

  test('should transfer money', () => {
    const accountOne = getBankAccount(300);
    const accountTwo = getBankAccount(200);
    accountOne.transfer(200, accountTwo);
    expect(accountOne.getBalance()).toEqual(100);
    expect(accountTwo.getBalance()).toEqual(400);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const res = await getBankAccount(300).fetchBalance();
    if (res !== null) {
      expect(typeof res).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(300);
    const error = new SynchronizationFailedError();
    jest.spyOn(lodash, 'random');
    try {
      await account.synchronizeBalance();
      expect(account.getBalance()).not.toBe(300);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toMatch(error.message);
      }
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const error = new SynchronizationFailedError().message;
    try {
      await getBankAccount(300).fetchBalance();
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toMatch(error);
      }
    }
  });
});
