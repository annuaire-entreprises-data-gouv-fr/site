class HttpError extends Error {
  constructor(public message: string, public status = 500) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class HttpNotFound extends HttpError {
  constructor(public message: string) {
    super(message, 404);
  }
}

export class HttpServerError extends HttpError {
  constructor(public message: string) {
    super(message, 500);
  }
}
export class HttpTimeoutError extends HttpError {
  constructor(public message: string) {
    super(message, 408);
  }
}

export class HttpTooManyRequests extends HttpError {
  constructor(public message: string) {
    super(message, 429);
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(public message: string) {
    super(message, 401);
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(public message: string) {
    super(message, 403);
  }
}
