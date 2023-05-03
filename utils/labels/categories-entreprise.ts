export const categoriesEntreprisesOptions = [
  {
    label: 'Petite ou Moyenne Entreprise',
    value: 'PME',
  },
  {
    label: 'Entreprise de Taille Intermédiaire',
    value: 'ETI',
  },
  {
    label: 'Grande Entreprise',
    value: 'GE',
  },
];

export const categoriesEntreprise = (code: string) => {
  //@ts-ignore
  const categorie = categoriesEntreprisesMap[code];
  if (categorie) {
    return categorie;
  }
  return null;
};

const formatAsMap = () => {
  return categoriesEntreprisesOptions.reduce((aggregator, code) => {
    //@ts-ignore
    aggregator[code.value] = code.label;
    return aggregator;
  }, {});
};

const categoriesEntreprisesMap = formatAsMap();
