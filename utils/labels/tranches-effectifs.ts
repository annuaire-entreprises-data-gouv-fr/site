/**
 * TPE (Très Petites Entreprises)
 * PME (Petite ou moyenne entreprise)
 * ETI (Entreprise de taille intermédiaire)
 * GE  (Grandes entreprises)
 * @see https://github.com/etalab/annuaire-entreprises-search-api/blob/main/aio/aio-proxy/aio_proxy/labels/tranches-effectifs.json
 */
export const tranchesEffectifs = [
  {
    label: 'Entreprise sans salarié ou nombre de salarié inconnu',
    value: '00,NN',
  },
  {
    label: '1 - 19 salariés',
    value: '01,02,03,11',
  },
  {
    label: '20 - 249 salariés',
    value: '12,21,22,31',
  },
  {
    label: '250 - 4999 salariés',
    value: '32,41,42,51',
  },
  {
    label: '5000 salariés et plus',
    value: '52,53',
  },
];
