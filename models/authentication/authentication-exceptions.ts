import { Exception } from '#models/exceptions';

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any; context?: { slug: string } }) {
    super({
      name: 'AgentConnectionFailed',
      ...args,
    });
  }
}

export class PrestataireException extends Exception {
  constructor(details: string) {
    super({
      name: 'PrestataireException',
      context: {
        details,
      },
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

export class NeedASiretException extends Exception {
  constructor(message: string, userId: string) {
    super({
      name: 'OrganisationNeedASiretException',
      message,
      context: {
        details: userId,
      },
    });
  }
}
