import logErrorInSentry from '../../utils/sentry';

/**
 * Format INPI date field (string or number) to relevant format YYYY-MM-DD
 * @param unformatted
 * @returns formatted date
 */
export const formatINPIDateField = (unformatted: string | number): string => {
  try {
    if (!unformatted) {
      return '';
    }
    if (typeof unformatted === 'number') {
      // YYYYMMDD as number
      const YYYYMMDD = unformatted.toString();
      return `${YYYYMMDD.substr(0, 4)}-${YYYYMMDD.substr(
        4,
        2
      )}-${YYYYMMDD.substr(6)}`;
    } else if (unformatted.indexOf('/') === 2) {
      // DD/MM/YYYY
      const times = unformatted.split('/');
      return `${times[2]}-${times[1]}-${times[0]}`;
    } else if (unformatted.indexOf('-') === 2) {
      // DD-MM-YYYY
      const times = unformatted.split('-');
      return `${times[2]}-${times[1]}-${times[0]}`;
    } else if (unformatted.indexOf('-') === 4) {
      // YYYY-MM-DD
      return unformatted;
    } else {
      throw new Error('Unknown date format');
    }
  } catch (e) {
    logErrorInSentry('Unknwon date format in INPI’s reponse', {
      details: `${unformatted}`,
    });
    return '';
  }
};
