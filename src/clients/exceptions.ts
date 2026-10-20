class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.name = "HttpError";
  }
}

export class HttpLocked extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 423, options);
    this.name = "HttpLocked";
  }
}

export class HttpNotFound extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
    this.name = "HttpNotFound";
  }
}

export class HttpUnprocessableEntity extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 422, options);
    this.name = "HttpUnprocessableEntity";
  }
}

export class HttpConflict extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 409, options);
    this.name = "HttpConflict";
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
    this.name = "HttpBadRequestError";
  }
}

export class HttpServerError extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
    this.name = "HttpServerError";
  }
}

export class HttpConnectionReset extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
    this.name = "HttpConnectionReset";
  }
}

export class HttpTimeoutError extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 408, options);
    this.name = "HttpTimeoutError";
  }
}

export class HttpTooManyRequests extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 429, options);
    this.name = "HttpTooManyRequests";
  }
}
export class AgentOverRateLimit extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 432, options);
    this.name = "AgentOverRateLimit";
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
    this.name = "HttpUnauthorizedError";
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 403, options);
    this.name = "HttpForbiddenError";
  }
}
