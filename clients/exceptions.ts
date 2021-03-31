export class HttpNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

export class HttpServerError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
export class HttpTimeoutError extends HttpServerError {
  constructor(public message: string) {
    super(504, message);
  }
}

export class HttpAuthentificationFailure extends Error {
  constructor(public message: string) {
    super();
  }
}
export class HttpTooManyRequests extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
