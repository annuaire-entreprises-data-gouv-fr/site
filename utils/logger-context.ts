type IContext = Record<string, string | number | boolean | null | undefined>;

export class LoggerContext {
  private name: string;
  private startTime: number;
  private status: "success" | "error" | "pending" = "pending";
  private context: IContext = {};

  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
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
    this.context = { ...this.context, ...context };

    console.info(JSON.stringify(this.toJSON()));
  }

  public error(
    errorName: string,
    errorMessage: string,
    context: Partial<IContext> = {}
  ) {
    this.status = "error";
    this.context = { ...this.context, ...context, errorName, errorMessage };

    console.error(JSON.stringify(this.toJSON()));
  }

  public toJSON() {
    return {
      name: this.name,
      startTime: this.startTime,
      status: this.status,
      context: this.context,
    };
  }
}
