type IContext = Record<string, string | number | boolean | null | undefined>;

const DEFAULT_P99_MS = 1000 * 60 * 5; // 5 minutes

export class LoggerContext {
  private name: string;
  private method: string | null = null;
  private startTimeMs: number;
  private endTimeMs: number | null = null;
  private status: "success" | "error" | "pending" = "pending";
  private p99Ms: number;
  private context: IContext = {};

  constructor(
    name: string,
    method: string | null = null,
    p99Ms: number = DEFAULT_P99_MS
  ) {
    this.name = name;
    this.startTimeMs = Date.now();
    this.method = method;
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

  public success(context: Partial<IContext> = {}) {
    this.status = "success";
    this.endTimeMs = Date.now();
    this.context = { ...this.context, ...context };

    if (this.shouldLog()) {
      console.info(JSON.stringify(this.toJSON()));
    }
  }

  public error(
    errorName: string,
    errorMessage: string,
    context: Partial<IContext> = {}
  ) {
    this.status = "error";
    this.endTimeMs = Date.now();
    this.context = { ...this.context, ...context, errorName, errorMessage };

    if (this.shouldLog()) {
      console.error(JSON.stringify(this.toJSON()));
    }
  }

  private get durationMs() {
    return this.endTimeMs ? this.endTimeMs - this.startTimeMs : null;
  }

  private toJSON() {
    return {
      name: this.name,
      method: this.method,
      startTime: this.startTimeMs,
      endTime: this.endTimeMs,
      duration: this.durationMs,
      status: this.status,
      context: this.context,
    };
  }

  private shouldLog() {
    // Always log the errors
    if (this.status === "error") {
      return true;
    }

    const isAboveP99Ms = !!this.durationMs && this.durationMs > this.p99Ms;

    // If the duration is above the p99Ms or 5% of the time, log the success
    if (this.status === "success" && (isAboveP99Ms || Math.random() < 0.05)) {
      return true;
    }
    return false;
  }
}
