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
