/**
 * Compute capital social
 *
 * @param capital
 * @param devise
 * @param estVariable
 * @returns
 */
export const getCapital = (
  capital: number,
  devise: string,
  estVariable: boolean
) => {
  if (capital) {
    try {
      return `${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: devise ?? "EUR",
      }).format(capital)} ${estVariable ? "(variable)" : "(fixe)"}`;
    } catch {
      return `${capital} ${devise} ${estVariable ? "(variable)" : "(fixe)"}`;
    }
  }
  return "";
};
