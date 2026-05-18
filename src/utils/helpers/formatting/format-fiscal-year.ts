export const getFiscalYear = (date_cloture_exercice: string) => {
  // determine fiscal year
  const clotureDate = new Date(date_cloture_exercice);
  const clotureYear = clotureDate.getFullYear();
  return clotureDate.getMonth() < 6 ? clotureYear - 1 : clotureYear;
};
