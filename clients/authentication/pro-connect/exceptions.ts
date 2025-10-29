import { Exception } from "#models/exceptions";

export class ProConnectReconnexionNeeded extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
  }) {
    super({ name: "ProConnectReconnexionNeeded", ...args });
  }
}
