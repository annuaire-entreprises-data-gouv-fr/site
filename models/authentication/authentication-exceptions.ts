import { Exception } from "#models/exceptions";
import type { Siren } from "#utils/helpers";

export class AgentConnectionFailedException extends Exception {
  constructor(args: { cause?: any; context?: { slug: string } }) {
    super({
      name: "AgentConnectionFailed",
      ...args,
    });
  }
}

export class PrestataireException extends Exception {
  constructor(details: string) {
    super({
      name: "PrestataireException",
      context: {
        details,
      },
    });
  }
}

export class CanRequestAuthorizationException extends Exception {
  constructor(siren: string, name: string) {
    super({
      name: "OrganisationCanRequestAuthorizationException",
      context: {
        details: name,
        siren,
      },
    });
  }
}

export class NeedASiretException extends Exception {
  constructor(message: string, userId: string) {
    super({
      name: "OrganisationNeedASiretException",
      message,
      context: {
        details: userId,
      },
    });
  }
}

export class OrganisationNotAnAdministration extends Exception {
  constructor(siren: Siren, name: string) {
    super({
      name: "OrganisationIsNotAnAdministration",
      context: {
        siren,
        details: name,
      },
    });
  }
}
