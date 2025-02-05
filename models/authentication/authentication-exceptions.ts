import { Exception } from '#models/exceptions';

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'AgentConnectionFailed',
      ...args,
    });
  }
}

export class PrestataireException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'PrestataireException',
      ...args,
    });
  }
}

export class CanRequestAuthorizationException extends Exception {
  constructor(codeJuridique: string, siren: string) {
    super({
      name: 'OrganisationCanRequestAuthorizationException',
      context: {
        details: codeJuridique,
        siren,
      },
    });
  }
}

export class NoSiretException extends Exception {
  constructor(message: string, userId: string) {
    super({
      name: 'OrganisationNoSiretException',
      message,
      context: {
        details: userId,
      },
    });
  }
}
