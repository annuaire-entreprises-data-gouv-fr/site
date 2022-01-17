import Tabs from './tabs';
import LateralMenu from './lateral-menu';
import Title from './title';

export enum FICHE {
  DOCUMENTS = 'mes documents',
  SIMULATIONS = 'mes simulations',
  INFORMATION = 'informations générales',
  JUSTIFICATIFS = 'justificatifs',
  ANNONCES = 'annonces',
  DIRIGEANTS = 'dirigeants',
  COMPTES = 'bilans & comptes',
  ACTES = 'actes & statuts',
  DIVERS = 'conventions collectives',
}

export const menu = [
  {
    title: 'Accueil',
    type: FICHE.DOCUMENTS,
    path: (siren: string) => `/comptes/documents/${siren}`,
    private: true,
  },
  {
    title: 'Informations générales',
    type: FICHE.INFORMATION,
    path: (siren: string) => `/entreprise/${siren}`,
    private: false,
  },
  {
    title: 'Justificatifs',
    type: FICHE.JUSTIFICATIFS,
    path: (siren: string) => `/justificatif/${siren}`,
    private: false,
  },
  {
    title: 'Dirigeants',
    type: FICHE.DIRIGEANTS,
    path: (siren: string) => `/dirigeants/${siren}`,
    private: false,
  },
  {
    title: 'Annonces',
    type: FICHE.ANNONCES,
    path: (siren: string) => `/annonces/${siren}`,
    private: false,
  },
  {
    title: 'Documents',
    type: FICHE.DIVERS,
    path: (siren: string) => `/divers/${siren}`,
    private: false,
  },
  // a ajouter avec une ligne ou un separateur
  // {
  //   title: 'Simulateurs',
  //   type: FICHE.SIMULATIONS,
  //   path: (siren: string) => `/comptes/simulateurs/${siren}`,
  //   private: true,
  // },
];

export { Title, Tabs, LateralMenu };

export default Title;
