const constants = {
  links: {
    mailto: 'mailto:annuaire-entreprises@data.gouv.fr',
    mail: 'annuaire-entreprises@data.gouv.fr',
    mailtoInpi: 'mailto:licences@inpi.fr',
    mailInpi: 'licences@inpi.fr',
    parcours: {
      modification: '/faq/parcours?question=modification',
      contact: '/faq/parcours?question=contact',
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
