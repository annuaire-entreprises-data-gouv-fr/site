import { fetchRnmImmatriculation } from './immatriculation';

export class RnmHttpServerError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

export { fetchRnmImmatriculation };
