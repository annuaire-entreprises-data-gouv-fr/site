/**
 * API SIRENE by Etalab
 *
 * This API provide :
 * - a Results route for search pages
 * - an UniteLegale for entreprise pages
 * - an Etablissement for etablissement pages
 *
 */

export class SireneEtalabTooManyRequestsError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
export class SireneEtalabNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
export class SireneEtalabServerError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}
