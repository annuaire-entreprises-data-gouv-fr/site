export const categoriesEntreprise = (code: string) => {
  if (code === 'GE') {
    return 'Grande Entreprise';
  } else if (code === 'PME') {
    return 'Petite ou Moyenne Entreprise';
  } else if (code === 'ETI') {
    return 'Entreprise de Taille Intermédiaire';
  }
  return null;
};

export const categoriesEntrepriseFilterOptions = [
  {
    label: 'Grande Entreprise',
    value: 'GE',
  },
  {
    label: 'Entreprise de Taille Intermédiaire',
    value: 'ETI',
  },
  {
    label: 'Petite ou Moyenne Entreprise',
    value: 'PME',
  },
];
