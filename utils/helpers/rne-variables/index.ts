import { formatDate } from '../formatting/formatting';

/**
 * compute date at which personne morale will end
 * @param duree
 * @param dateImmatriculation
 * @returns
 */
export function getDateFin(
  duree: number | null,
  dateImmatriculation: string | null
): string {
  try {
    if (duree && dateImmatriculation) {
      const d = new Date(dateImmatriculation);
      d.setFullYear(d.getFullYear() + duree);
      return formatDate(d) || '';
    }
  } catch {}
  return '';
}

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
      return `${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: devise ?? 'EUR',
      }).format(capital)} ${estVariable ? '(variable)' : '(fixe)'}`;
    } catch {
      return `${capital} ${devise} ${estVariable ? '(variable)' : '(fixe)'}`;
    }
  }
  return '';
};
