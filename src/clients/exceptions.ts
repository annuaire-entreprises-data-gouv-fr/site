class HttpError extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export class HttpLocked extends HttpError {
  constructor(message: string) {
    super(message, 423);
    this.name = "HttpLocked";
  }
}

export class HttpNotFound extends HttpError {
  constructor(message: string) {
    super(message, 404);
    this.name = "HttpNotFound";
  }
}

export class HttpUnprocessableEntity extends HttpError {
  constructor(message: string) {
    super(message, 422);
    this.name = "HttpUnprocessableEntity";
  }
}

export class HttpConflict extends HttpError {
  constructor(message: string) {
    super(message, 409);
    this.name = "HttpConflict";
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
    this.name = "HttpBadRequestError";
  }
}

export class HttpServerError extends HttpError {
  constructor(message: string) {
    super(message, 500);
    this.name = "HttpServerError";
  }
}

export class HttpConnectionReset extends HttpError {
  constructor(message: string) {
    super(message, 500);
    this.name = "HttpConnectionReset";
  }
}

export class HttpTimeoutError extends HttpError {
  constructor(message: string) {
    super(message, 408);
    this.name = "HttpTimeoutError";
  }
}

export class HttpTooManyRequests extends HttpError {
  constructor(message: string) {
    super(message, 429);
    this.name = "HttpTooManyRequests";
  }
}
export class AgentOverRateLimit extends HttpError {
  constructor(message: string) {
    super(message, 432);
    this.name = "AgentOverRateLimit";
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
    this.name = "HttpUnauthorizedError";
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
    this.name = "HttpForbiddenError";
  }
}
