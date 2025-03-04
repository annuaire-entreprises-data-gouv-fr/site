const constants = {
  links: {
    mailtoInpi: 'mailto:licences@inpi.fr',
    mailInpi: 'licences@inpi.fr',
    tchap:
      'https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr',
    documentation: 'https://guides.data.gouv.fr/annuaire-des-entreprises',
    parcours: {
      modification: '/faq/modifier',
      contact: '/faq/parcours',
    },
  },
  resultsPerPage: { etablissements: 100, search: 30 },
  timeout: {
    XXS: 350,
    XS: 850,
    S: 1500,
    M: 3000,
    L: 5000,
    XL: 10000,
    XXL: 20000,
    XXXL: 30000,
    XXXXL: 45000,
  },
  colors: {
    frBlue: '#000091',
    pastelBlue: '#dfdff1',
    espaceAgent: '#CC007A',
    espaceAgentPastel: '#ffe8f4',
    yellow: '#fef6e3',
  },
  chartColors: [
    '#e60049',
    '#0bb4ff',
    '#50e991',
    '#e6d800',
    '#9b19f5',
    '#ffa300',
    '#dc0ab4',
    '#b3d4ff',
    '#00bfa0',
  ],
};

export default constants;
