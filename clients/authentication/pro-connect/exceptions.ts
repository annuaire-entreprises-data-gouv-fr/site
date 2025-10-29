import { Exception } from "#models/exceptions";

export class ProConnectRefreshTokenExpired extends Exception {
  constructor(args: {
    cause?: any;
  }) {
    super({ name: "ProConnectRefreshTokenExpired", ...args });
  }
}
