import { Exception } from '#models/exceptions';

export class AgentConnectLogoutFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}

export class AgentConnectFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectionFailedException',
      ...args,
    });
  }
}
