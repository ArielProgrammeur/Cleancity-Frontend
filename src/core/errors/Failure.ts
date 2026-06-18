export class Failure {
  readonly message: string;
  readonly code: string;

  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    this.message = message;
    this.code = code;
  }
}

export class ServerFailure extends Failure {
  readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message, 'SERVER_ERROR');
    this.statusCode = statusCode;
  }
}

export class AuthFailure extends Failure {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
  }
}

export class NetworkFailure extends Failure {
  constructor(message: string = 'No internet connection') {
    super(message, 'NETWORK_ERROR');
  }
}

export class NotFoundFailure extends Failure {
  constructor(entity: string = 'Resource') {
    super(`${entity} not found`, 'NOT_FOUND');
  }
}
