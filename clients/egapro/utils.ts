import { AllNote, FormattedScores, Score } from './type';

export const formatScore = (allScore: AllNote): Score[] => {
  const formattedScores: FormattedScores = {};
  Object.entries(allScore).forEach(([category, scores]) => {
    Object.entries(scores).forEach(([key, value]) => {
      formattedScores[key] = {
        ...formattedScores[key],
        [category]: value,
      };
    });
  });

  return Object.entries(formattedScores).map(([key, value]) => ({
    annee: key.toString(),
    ...value,
  }));
};
