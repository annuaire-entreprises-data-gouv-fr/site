type ApplicationField<T> = {
  value: T;
  provider: string;
  last_update: string;
  type: string;
};

type SubventionStatus = 'Accordé' | 'Refusé' | 'Prise en charge' | 'Recevable';
type SubventionLabel = 'Accordé' | 'Refusé' | 'En instruction';

type Contact = {
  email: ApplicationField<string>;
  telephone: ApplicationField<string>;
};

type Montants = {
  total: ApplicationField<number>;
  demande: ApplicationField<number>;
  propose: ApplicationField<number>;
  accorde: ApplicationField<number>;
};

type Versement = {
  acompte: ApplicationField<number>;
  solde: ApplicationField<number>;
  realise: ApplicationField<number>;
  compensation: {
    'n-1': ApplicationField<number>;
    reversement: ApplicationField<number>;
  };
};

type Payment = {
  activitee: ApplicationField<string>;
  amount: ApplicationField<number>;
  bop: ApplicationField<string>;
  branche: ApplicationField<string>;
  centreFinancier: ApplicationField<string>;
  codeBranche: ApplicationField<string>;
  dateOperation: ApplicationField<string>;
  domaineFonctionnel: ApplicationField<string>;
  ej: ApplicationField<string>;
  libelleProgramme: ApplicationField<string>;
  numeroDemandePayment: ApplicationField<string>;
  numeroTier: ApplicationField<string>;
  programme: ApplicationField<string>;
  siret: ApplicationField<string>;
  versementKey: ApplicationField<string>;
};

type ActionProposeeType = {
  ej: ApplicationField<string>;
  rang: ApplicationField<number>;
  intitule: ApplicationField<string>;
  objectifs: ApplicationField<string>;
  objectifs_operationnels: {
    provider: string;
    last_update: string;
    type: string;
  };
  description: ApplicationField<string>;
};

type TerritoireType = {
  status: {
    provider: string;
    last_update: string;
    type: string;
  };
  commentaire: ApplicationField<string>;
};

type Application = {
  actions_proposee: ActionProposeeType[];
  annee_demande: ApplicationField<number>;
  contact: Contact;
  // This is the name of the subvention
  dispositif: ApplicationField<string>;
  ej: ApplicationField<string>;
  financeur_principal: ApplicationField<string>;
  montants: Montants;
  pluriannualite: ApplicationField<string>;
  service_instructeur: ApplicationField<string>;
  siret: ApplicationField<string>;
  sous_dispositif: ApplicationField<string>;
  status: ApplicationField<SubventionStatus>;
  statut_label: ApplicationField<SubventionLabel>;
  territoires: TerritoireType[];
  versement: Versement;
  versementKey: ApplicationField<string>;
};

type IGrantItem = {
  application: Application;
  payments: Payment[];
};
