import { Exception } from "../exceptions";

export interface IFondation {
  address: string | null;
  creationDate: string;
  department: string | null;
  foundationType: string;
  generalInterestDomain: string | null;
  hasInternationalActivity: boolean | null;
  id: string;
  postalCode: string;
  siret: string | null;
  socialObject: string | null;
  state: string | null;
  stateEffectiveAt: string | null;
  title: string;
}

/**
 * This is a valid id RNF but it was not found
 */
export class IdRnfNotFoundError extends Exception {
  constructor(idRnf: string) {
    super({
      name: "IdRnfNotFoundError",
      message: "This is a valid id RNF but it was not found",
      context: { idRnf },
    });
  }
}

/**
 * This does not even look like a id RNF
 */
export class NotAnIdRnfError extends Exception {
  constructor(idRnf: string) {
    super({
      name: "NotAnIdRnfError",
      message: "This does not even look like an id RNF",
      context: { idRnf },
    });
  }
}
