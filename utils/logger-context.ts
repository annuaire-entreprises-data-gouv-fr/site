import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

type IContext = Record<string, string | number | boolean | null | undefined>;

type Status = "success" | "failure" | "unknown";

interface LoggerEvent {
  action: string;
  category: string[];
  type: string;
}

interface LoggerUrl {
  domain: string;
  full: string;
  path: string;
}

interface LoggerRequest {
  method: string;
  requestId: string;
}

interface LoggerError {
  message: string;
  type: string;
}

interface LoggerService {
  name: string;
  type: string;
  url: LoggerUrl;
}

interface LoggerUser {
  id: string;
}

const DEFAULT_P99_MS = 1000 * 60 * 5; // 5 minutes

export class LoggerContext {
  private event: LoggerEvent;
  private url: LoggerUrl;
  private request: LoggerRequest;
  private user: LoggerUser | null = null;
  private startTimeMs: number;
  private p99Ms: number;
  private context: IContext = {};

  constructor(options: {
    event: LoggerEvent;
    url: LoggerUrl;
    request: Omit<LoggerRequest, "requestId"> & {
      requestId: LoggerRequest["requestId"] | null;
    };
    user?: LoggerUser;
    p99Ms?: number;
  }) {
    const {
      event,
      url,
      request,
      user = null,
      p99Ms = DEFAULT_P99_MS,
    } = options;

    this.event = event;
    this.startTimeMs = Date.now();
    this.url = url;
    this.request = request.requestId
      ? (request as LoggerRequest)
      : {
          ...request,
          requestId: `auto-generated-${randomUUID()}`,
        };
    this.user = user;
    this.p99Ms = p99Ms;
  }

  public setContext(context: Partial<IContext>) {
    this.context = { ...this.context, ...context };
  }

  public setContextKey(key: string, value: IContext[keyof IContext]) {
    this.context[key] = value;
  }

  public getContextKey(key: string) {
    return this.context[key];
  }

  public success(options: {
    service?: LoggerService;
    statusCode?: number;
    startTimeMs?: number;
    context?: Partial<IContext>;
  }) {
    const {
      service = null,
      statusCode = 200,
      startTimeMs = this.startTimeMs,
      context = {},
    } = options;

    const endTimeMs = Date.now();

    if (this.shouldLog(false, endTimeMs)) {
      console.info(
        JSON.stringify(
          this.toJSON({
            status: "success",
            statusCode,
            endTimeMs,
            startTimeMs,
            context,
            service,
            error: null,
          })
        )
      );
    }
  }

  public error(options: {
    error: LoggerError;
    statusCode: number;
    service?: LoggerService;
    startTimeMs?: number;
    context?: Partial<IContext>;
  }) {
    const {
      error,
      statusCode,
      service = null,
      startTimeMs = this.startTimeMs,
      context = {},
    } = options;
    const endTimeMs = Date.now();

    if (this.shouldLog(true, endTimeMs)) {
      console.error(
        JSON.stringify(
          this.toJSON({
            status: "failure",
            statusCode,
            error,
            service,
            context,
            startTimeMs,
            endTimeMs,
          })
        )
      );
    }
  }

  private getDurationMs(endTimeMs: number) {
    return endTimeMs - this.startTimeMs;
  }

  private toJSON(result: {
    status: Status;
    statusCode: number;
    startTimeMs?: number;
    endTimeMs: number;
    error: LoggerError | null;
    service: LoggerService | null;
    context: IContext;
  }) {
    const {
      status,
      statusCode,
      startTimeMs,
      endTimeMs,
      error,
      service,
      context,
    } = result;

    return {
      "@timestamp": this.startTimeMs,
      event: {
        ...this.event,
        outcome: status,
        start: startTimeMs ?? this.startTimeMs,
        end: endTimeMs,
        duration: this.getDurationMs(endTimeMs),
      },
      http: {
        ...(this.request ? { request: this.request } : {}),
        response: {
          status_code: statusCode,
        },
      },
      ...(this.url ? { url: this.url } : {}),
      ...(error ? { error } : {}),
      ...(service ? { service } : {}),
      ...(this.user ? { user: this.user } : {}),
      labels: { ...this.context, ...context },
    };
  }

  private shouldLog(isFailure: boolean, endTimeMs: number) {
    // Always log the errors
    if (isFailure) {
      return true;
    }

    const isAboveP99Ms = this.getDurationMs(endTimeMs) > this.p99Ms;

    // If the duration is above the p99Ms or 5% of the time, log the success
    if (!isFailure && (isAboveP99Ms || Math.random() < 0.05)) {
      return true;
    }
    return false;
  }
}

const loggerContextStorage = new AsyncLocalStorage<LoggerContext>();

export const runWithLoggerContext = <T>(
  context: LoggerContext,
  fn: () => T
): T => {
  return loggerContextStorage.run(context, fn);
};

export const getLoggerContext = (): LoggerContext | undefined => {
  return loggerContextStorage.getStore();
};
