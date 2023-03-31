import { Entries } from 'types';
import {
  IEgaproNote,
  IFormattedScores,
  IEgaproScore,
  ITrancheType,
} from './types';

export const employeesSizeRangeMapping: Record<ITrancheType, string> = {
  '50:250': '50 à 250 salariés',
  '251:999': '251 à 999 salariés',
  '1000:': '1000 salariés ou plus',
};

export const formatScore = (allScore: IEgaproNote): IEgaproScore[] => {
  const formattedScores: IFormattedScores = {};
  (Object.entries(allScore) as Entries<typeof allScore>).forEach(
    ([category, scores]) => {
      Object.entries(scores).forEach(([key, value]) => {
        formattedScores[key] = {
          ...formattedScores[key],
          [category]: value ?? null,
        };
      });
    }
  );
  return Object.entries(formattedScores).map(([key, value]) => ({
    ...value,
    annee: key.toString() ?? null,
  })) as IEgaproScore[];
};
