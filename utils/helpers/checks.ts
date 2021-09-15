export const isEntrepreneurIndividuelFromNatureJuridique = (
  natureJuridique: string
) => ['1', '10', '1000'].indexOf(natureJuridique) > -1;

export const isTwoMonthOld = (dateAsString: string) => {
  try {
    const date = new Date(dateAsString);
    const timeDifference = new Date().getTime() - date.getTime();

    return Math.round(timeDifference / (3600 * 24 * 1000)) > 60;
  } catch {
    return false;
  }
};
