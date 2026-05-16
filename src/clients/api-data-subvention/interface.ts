interface ApplicationField<T> {
  last_update: string;
  provider: string;
  type: string;
  value: T;
}

type SubventionStatus = "Accordé" | "Refusé" | "Prise en charge" | "Recevable";
type SubventionLabel = "Accordé" | "Refusé" | "En instruction";

interface Contact {
  email: ApplicationField<string>;
  telephone: ApplicationField<string>;
}

interface Montants {
  accorde: ApplicationField<number>;
  demande: ApplicationField<number>;
  propose: ApplicationField<number>;
  total: ApplicationField<number>;
}

interface Versement {
  acompte: ApplicationField<number>;
  compensation: {
    "n-1": ApplicationField<number>;
    reversement: ApplicationField<number>;
  };
  realise: ApplicationField<number>;
  solde: ApplicationField<number>;
}

interface Payment {
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
}

interface ActionProposeeType {
  description: ApplicationField<string>;
  ej: ApplicationField<string>;
  intitule: ApplicationField<string>;
  objectifs: ApplicationField<string>;
  objectifs_operationnels: {
    provider: string;
    last_update: string;
    type: string;
  };
  rang: ApplicationField<number>;
}

interface TerritoireType {
  commentaire: ApplicationField<string>;
  status: {
    provider: string;
    last_update: string;
    type: string;
  };
}

interface Application {
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
}

interface IGrantItem {
  application: Application;
  payments: Payment[];
}
