import { IUniteLegale } from '#models/core/types';

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

export const libelleCategorieEntreprise = (uniteLegale: IUniteLegale) => {
  const { categorieEntreprise, anneeCategorieEntreprise } = uniteLegale;

  if (!anneeCategorieEntreprise) {
    return null;
  }

  const libelle = categoriesEntreprise(categorieEntreprise || '');

  if (!libelle) {
    return null;
  }

  return `${libelle} (${categorieEntreprise}), en ${anneeCategorieEntreprise}`;
};

export const libelleCategorieEntrepriseForDescription = (
  uniteLegale: IUniteLegale
) => {
  const { categorieEntreprise, anneeCategorieEntreprise } = uniteLegale;

  if (!anneeCategorieEntreprise) {
    return null;
  }

  const libelle = categoriesEntreprise(categorieEntreprise || '');

  if (!libelle) {
    return null;
  }

  return ` En ${anneeCategorieEntreprise}, elle était catégorisée ${libelle}.`;
};
