let timeoutIncreaseFactor = Number(
  import.meta.env.VITE_TIMEOUT_INCREASE_FACTOR || 1
);
if (!timeoutIncreaseFactor || Number.isNaN(timeoutIncreaseFactor)) {
  timeoutIncreaseFactor = 1;
}

const constants = {
  links: {
    mailtoInpi: "mailto:licences@inpi.fr",
    mailInpi: "licences@inpi.fr",
    tchap:
      "https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr",
    documentation: {
      home: "https://guides.data.gouv.fr/annuaire-des-entreprises",
      agentRateLimiting:
        "https://guides.data.gouv.fr/annuaire-des-entreprises/pour-approfondir/plafond-de-consultation-de-donnees",
      agentDecouverte:
        "https://guides.data.gouv.fr/annuaire-des-entreprises/pour-bien-commencer/decouvrir-lespace-agent",
      habilitation:
        "https://guides.data.gouv.fr/annuaire-des-entreprises/pour-approfondir/types-de-donnees-et-habilitations/obtenir-une-habilitation",
    },
    parcours: {
      modification: "/faq/modifier",
      contact: "/faq/parcours",
    },
  },
  resultsPerPage: { etablissements: 100, search: 30 },
  timeout: {
    XXS: 350 * timeoutIncreaseFactor,
    XS: 850 * timeoutIncreaseFactor,
    S: 1500 * timeoutIncreaseFactor,
    M: 3000 * timeoutIncreaseFactor,
    L: 5000 * timeoutIncreaseFactor,
    XL: 10_000 * timeoutIncreaseFactor,
    XXL: 20_000 * timeoutIncreaseFactor,
    XXXL: 30_000 * timeoutIncreaseFactor,
    XXXXL: 45_000 * timeoutIncreaseFactor,
    XXXXXL: 120_000 * timeoutIncreaseFactor,
  },
  colors: {
    frBlue: "#000091",
    pastelBlue: "#dfdff1",
    espaceAgent: "#CC007A",
    espaceAgentPastel: "#ffe8f4",
    yellow: "#fef6e3",
  },
  chartColors: [
    "#e60049",
    "#0bb4ff",
    "#50e991",
    "#e6d800",
    "#9b19f5",
    "#ffa300",
    "#dc0ab4",
    "#b3d4ff",
    "#00bfa0",
  ],
} as const;

export default constants;
