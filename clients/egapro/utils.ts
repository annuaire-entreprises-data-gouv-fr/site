import { AllNote, Entries, FormattedScores, Score, TrancheType } from './type';

export const employeesSizeRangeMapping: Record<TrancheType, string> = {
  '50:250': '50 à 250 salariés',
  '251:999': '251 à 999 salariés',
  '1000:': '1000 salariés ou plus',
};

export const formatScore = (allScore: AllNote): Score[] => {
  const formattedScores: FormattedScores = {};
  (Object.entries(allScore) as Entries<typeof allScore>).forEach(
    ([category, scores]) => {
      Object.entries(scores).forEach(([key, value]) => {
        formattedScores[key] = {
          ...formattedScores[key],
          [category]: value || 0,
        };
      });
    }
  );
  return Object.entries(formattedScores).map(([key, value]) => ({
    annee: key.toString(),
    ...value,
  })) as Score[];
};
