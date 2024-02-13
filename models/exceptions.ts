import { EAdministration } from './administrations/EAdministration';

type IExceptionArgument = {
  /** Name of the exception, CamelCase
   *  @example SiretNotFoundError
   *
   *  Should inform about what went wrong from a business point of view
   */
  name: string;
  /** Message of the exception */
  message?: string;
  /** The technical error for this exception */
  cause?: any;

  /** Contextual information about the exception */
  context?: {
    siren?: string;
    idRna?: string | null;
    siret?: string;
    slug?: string;
    details?: string;
    page?: string;
    referrer?: string;
    browser?: string;
  };
};

export type IExceptionContext = NonNullable<IExceptionArgument['context']>;

export class Exception extends Error {
  public name: string;
  public context: IExceptionContext;
  constructor({ name, message, cause, context }: IExceptionArgument) {
    if (message == undefined && cause && 'name' in cause) {
      message = cause.name;
      if ('message' in cause) {
        message += `: ${cause.message}`;
      }
    }
    super(message, { cause });
    this.name = name;
    this.context = context ?? {};
  }
}

export const Information = Exception;

type IFetchRessourceExceptionArgument = {
  /** Name of the ressource, CamelCase
   *  @example BODACC
   *  @example ComptesAssociation
   *
   *  Should inform about what went wrong from a business point of view
   */
  ressource: string;
  /** The administration that was called */
  administration?: EAdministration;
} & Omit<IExceptionArgument, 'name'>;

export class FetchRessourceException extends Exception {
  public administration: EAdministration | undefined;
  constructor({
    administration,
    ressource,
    ...rest
  }: IFetchRessourceExceptionArgument) {
    const name = `Fetch${ressource}Exception`;
    super({ name, ...rest });
    this.administration = administration;
  }
}

/**
 * Throw an error when a case is not supposed to happen (ex: a switch case that should never happen)
 *
 * This is a way to make sure that the code is exhaustive, because the typescript compiler will complain otherwise
 *
 * @param value The value that should not be reached
 */
export function throwUnreachableCaseError(value: never): never {
  throw new InternalError({
    message: `Unreachable case`,
    context: { details: value },
  });
}
/**
 * Represents an internal error.
 * This error should never be thrown.
 * If it is, it means that there is a bug in the code.
 */

export class InternalError extends Exception {
  constructor(args: {
    message: string;
    cause?: any;
    context?: IExceptionContext;
  }) {
    super({ name: 'InternalError', ...args });
  }
}
