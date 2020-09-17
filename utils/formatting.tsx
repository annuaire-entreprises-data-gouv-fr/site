const castDate = (date: string | Date) =>
  typeof date === 'string' ? new Date(date) : date;

const longDateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const formatDateLong = (date: string | Date) =>
  new Intl.DateTimeFormat('fr-FR', longDateOptions).format(castDate(date));

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('fr-FR').format(castDate(date));

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const concatNames = (firstName: string, lastName: string) => {
  const last = (lastName || '').toUpperCase();
  const first = capitalize(firstName || '');

  if (first !== '' && last !== '') return `${first} ${last}`;
  else return last;
};

export const formatNumbersFr = (numberAsString = '') => {
  return numberAsString.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
};

export const formatSiret = (siret = '') => {
  return siret.replace(/(\d{3})/g, '$1 ').replace(/(\s)(?=(\d{2})$)/g, '');
};
