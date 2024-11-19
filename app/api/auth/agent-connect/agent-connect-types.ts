import { Exception, IExceptionContext } from '#models/exceptions';

export class AgentConnectLogoutFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}

export class AgentConnectFailedException extends Exception {
  constructor(args: {
    cause: any;
    message?: string;
    context?: IExceptionContext;
  }) {
    super({
      name: 'AgentConnectionFailedException',
      ...args,
    });
  }
}

export class AgentConnectCouldBeAServicePublicException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectCouldBeAServicePublicException',
      ...args,
    });
  }
}

export class AgentConnectMCPNoSiretException extends Exception {
  constructor(message: string, userId: string) {
    super({
      name: 'AgentConnectMCPNoSiretException',
      message,
      context: {
        details: userId,
      },
    });
  }
}

export class AgentConnectProviderNoSiretException extends Exception {
  constructor(message: string, idpId: string) {
    super({
      name: 'AgentConnectProviderNoSiretException',
      message,
      context: {
        details: idpId,
      },
    });
  }
}
