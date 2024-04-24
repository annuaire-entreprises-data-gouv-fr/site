import { InternalError } from '#models/exceptions';
import { libelleFromTypeVoie } from '#utils/helpers/formatting/labels';
import logErrorInSentry from '#utils/sentry';

const timeZone = 'UTC';

/**
 * Wrapper that ensure every formatter is safe to run
 * @param castAndFormat
 * @returns
 */
const safe =
  <T extends unknown[], R>(castAndFormat: (...args: T) => R) =>
  (...args: T): R | string => {
    try {
      return castAndFormat.apply(null, args);
    } catch (e: any) {
      let argsAsString = '';
      try {
        argsAsString = args.toString();
      } catch {}
      logErrorInSentry(
        new InternalError({
          message: 'Formatting error in view',
          cause: e,
          context: {
            details: argsAsString,
          },
        })
      );

      return argsAsString;
    }
  };

const castDate = (date: string | Date) =>
  typeof date === 'string' ? new Date(date) : date;

const longDateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone,
};

const longDatePartial = {
  year: 'numeric',
  month: 'long',
  timeZone,
};

const yearOption = {
  year: 'numeric',
  timeZone,
};

/**
 * Format a string as percentage
 * @param value
 * @param digits number of digits
 * @returns
 */
export const formatPercentage = safe((value: string, digits: number = 1) => {
  let number = parseFloat(value);
  if (!number) {
    return undefined;
  }

  return parseFloat(value).toFixed(digits) + '%';
});

export const formatCurrency = safe(
  (value: string | number | undefined | null) => {
    const number = parseInt(value + '', 10);
    if (!number && number !== 0) {
      return value as string;
    }

    const unitlist = ['€', 'K €', 'M €', 'Mds €'];
    const sign = Math.sign(number);

    const orderOfMagnitude = Math.floor(
      (Math.abs(number).toString().length - 1) / 3
    );
    const magnitude = Math.pow(1000, orderOfMagnitude);
    const roundedValue = Math.floor(Math.abs(number / magnitude) * 10) / 10;

    return `${sign * roundedValue} ${unitlist[orderOfMagnitude]}`;
  }
);

export const formatDateYear = safe(
  (date: string | Date): string | undefined => {
    if (!date) {
      return undefined;
    }
    //@ts-ignore
    return new Intl.DateTimeFormat('fr-FR', yearOption).format(castDate(date));
  }
);

export const formatDatePartial = safe((date: string | Date | undefined) => {
  if (!date) {
    return undefined;
  }
  //@ts-ignore
  return new Intl.DateTimeFormat('fr-FR', longDatePartial).format(
    castDate(date)
  );
});

export const formatDateLong = safe((date: string | Date) => {
  if (!date) {
    return undefined;
  }
  //@ts-ignore
  return new Intl.DateTimeFormat('fr-FR', longDateOptions).format(
    castDate(date)
  );
});

export const formatDate = safe((date: string | Date | undefined) =>
  date
    ? new Intl.DateTimeFormat('fr-FR', { timeZone }).format(castDate(date))
    : undefined
);

/**
 * Takes a YYYY-MM and return YYYY-MM-DD interval from begining to end of month
 *
 * @param dPartial
 * @returns [dmin, dmax]
 */
export const formatMonthIntervalFromPartialDate = safe((dPartial: string) => {
  const [yyyy, mm] = dPartial.split('-');

  const lastDayOfMonth = new Date(
    parseInt(yyyy, 10),
    parseInt(mm, 10),
    0
  ).getDate();

  return [`${dPartial}-01`, `${dPartial}-${lastDayOfMonth}`] as const;
});

export const formatAge = safe((date: string | Date) => {
  const now = new Date();
  const then = castDate(date);
  const monthDiff =
    now.getMonth() -
    then.getMonth() +
    12 * (now.getFullYear() - then.getFullYear());

  if (monthDiff >= 12) {
    const yearAge = Math.round(monthDiff / 12);
    return `${yearAge} an${yearAge >= 2 ? 's' : ''}`;
  }
  if (monthDiff === 0) {
    return undefined;
  }
  return `${monthDiff} mois`;
});

export const capitalize = safe((str: string) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
});

export const formatIntFr = safe((intAsString: string = '') => {
  if (!intAsString) {
    return intAsString;
  }
  return intAsString.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
});

export const formatFloatFr = safe((floatAsString: string = '') => {
  if (!floatAsString) {
    return floatAsString;
  }
  const floatAsNumber = parseFloat(floatAsString);
  return new Intl.NumberFormat('fr-FR').format(floatAsNumber);
});

/**
 * Serialize for injection in client script
 * @param term
 * @returns
 */
export const serializeForClientScript = (term = '') => {
  // remove signle quotes as they dont get serialize by encode/decodeUriComponent
  return encodeURIComponent(term.replaceAll("'", ''));
};

/**
 * Replace every chars that are not letters or numbers with -
 * @param term
 * @returns
 */
export const escapeString = (term = '') => {
  return removeSpecialChars(term).replaceAll(/[^a-zA-Z0-9]/g, '-');
};

/**
 * Normalize string and remove special chars & diacritics before using a term in search
 */
export const removeSpecialChars = (term = '') => {
  return term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+$/, '')
    .replace(/^\s+/, '');
};

/**
 * Turn a string into a slug for URL use
 */
export const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

/**
 * Removes whitespace
 */
export const trimWhitespace = (term = '') => {
  return term.split(' ').join('');
};

/**
 * Parse an int and return default value in case of failure
 */
export const parseIntWithDefaultValue = (
  intAsString: string,
  defaultValue = 0
) => {
  try {
    const result = parseInt(intAsString, 10);
    if (isNaN(result)) {
      throw new Error();
    }
    return result;
  } catch {
    return defaultValue;
  }
};

const wrapWord = (word: string | null | undefined = '', punct = ' ') => {
  if (!word) {
    return '';
  }
  return word.toString().toUpperCase() + punct;
};

type IAdressFields = {
  complement?: string | null | undefined;
  numeroVoie?: string | null | undefined;
  indiceRepetition?: string | null | undefined;
  typeVoie?: string | null | undefined;
  libelleVoie?: string | null | undefined;
  distributionSpeciale?: string | null | undefined;
  codePostal?: string | null | undefined;
  libelleCommune?: string | null | undefined;
  codeCedex?: string | null | undefined;
  libelleCommuneCedex?: string | null | undefined;
  libelleCommuneEtranger?: string | null | undefined;
  codePaysEtranger?: string | null | undefined;
  libellePaysEtranger?: string | null | undefined;
};

export const formatAdresse = ({
  complement = '',
  numeroVoie = '',
  indiceRepetition = '',
  typeVoie = '',
  libelleVoie = '',
  distributionSpeciale = '',
  codePostal = '',
  libelleCommune = '',
  codeCedex = '',
  libelleCommuneCedex = '',
  libelleCommuneEtranger = '',
  codePaysEtranger = '',
  libellePaysEtranger = '',
}: IAdressFields) => {
  if (
    !complement &&
    !numeroVoie &&
    !typeVoie &&
    !libelleCommune &&
    !distributionSpeciale &&
    !codePostal &&
    !codeCedex &&
    !libelleVoie &&
    !libelleCommuneEtranger &&
    !codePaysEtranger &&
    !libellePaysEtranger
  ) {
    return '';
  }

  const fullLibelleFromTypeVoie = libelleFromTypeVoie(typeVoie);

  return [
    wrapWord(complement, ', '),
    wrapWord(numeroVoie),
    wrapWord(indiceRepetition),
    wrapWord(fullLibelleFromTypeVoie),
    wrapWord(libelleVoie, ', '),
    wrapWord(distributionSpeciale, ', '),
    wrapWord(codeCedex || codePostal),
    wrapWord(
      libelleCommuneCedex || libelleCommune || libelleCommuneEtranger,
      ''
    ),
    libellePaysEtranger ? `, ${wrapWord(libellePaysEtranger, '')}` : '',
  ].join('');
};

export const agregateTripleFields = (
  field1: string | null,
  field2: string | null,
  field3: string | null
) => {
  if (!field1 && !field2 && !field3) {
    return null;
  }
  const field = `${field1 || ''} ${field2 || ''} ${field3 || ''}`;
  return field.trim();
};

export const formatFirstNames = (firstNames: string[], nameCount = 0) => {
  const formatted = firstNames.map(capitalize).filter((name) => !!name);
  if (nameCount > 0 && nameCount < firstNames.length) {
    return formatted.slice(0, nameCount).join(', ');
  }
  return formatted.join(', ');
};

export const formatNameFull = (nomPatronymique = '', nomUsage = '') => {
  if (nomUsage && nomPatronymique) {
    return `${nomUsage} (${nomPatronymique})`;
  }
  return nomUsage || nomPatronymique || '';
};
