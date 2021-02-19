export const isSirenOrSiret = (str: string) => {
  return (
    str.match(/^\d{9}|\d{14}$/g) && (str.length === 9 || str.length === 14)
  );
};

export const isSiret = (str: string) => {
  return str.match(/^\d{14}$/g) && str.length === 14;
};

export const isSiren = (str: string) => {
  return str.match(/^\d{9}$/g) && str.length === 9;
};

export const formatSiret = (siret = '') => {
  return siret.replace(/(\d{3})/g, '$1 ').replace(/(\s)(?=(\d{2})$)/g, '');
};
