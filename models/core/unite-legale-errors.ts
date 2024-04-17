import { IUniteLegale } from './types';

export enum EUniteLEgaleError {
  NotLuhnValid,
  NotFound,
  None,
}

export const hasError = (uniteLegale: IUniteLegale) => {
  if (uniteLegale.error !== EUniteLEgaleError.None) {
    return true;
  }
  return false;
};

export const isNotFound = (uniteLegale: IUniteLegale) => {
  if (uniteLegale.error === EUniteLEgaleError.NotFound) {
    return true;
  }
  return false;
};
export const isNotLuhnValid = (uniteLegale: IUniteLegale) => {
  if (uniteLegale.error === EUniteLEgaleError.NotLuhnValid) {
    return true;
  }
  return false;
};
