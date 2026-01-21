import { Exception } from "#models/exceptions";

export class ProConnectReconnexionNeeded extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
  }) {
    super({ name: "ProConnectReconnexionNeeded", ...args });
  }
}

export class ProConnect2FANeeded extends Exception {
  public loginHint: string;

  constructor(args: {
    message: string;
    cause?: any;
    loginHint: string;
  }) {
    super({ name: "ProConnect2FANeeded", ...args });
    this.loginHint = args.loginHint;
  }
}
