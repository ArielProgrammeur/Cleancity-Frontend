import { Failure } from '../errors';

export type Result<T> = Success<T> | Failure;

export class Success<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure {
    return false;
  }
}

export function success<T>(value: T): Result<T> {
  return new Success(value);
}

export function failure<T>(error: Failure): Result<T> {
  return error;
}
