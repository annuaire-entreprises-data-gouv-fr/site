export interface IFondationsRestreintes {
  dirigeants: Array<{
    nom?: string | null;
    prenom?: string | null;
    dateNaissance?: string | null;
    nationalite?: string | null;
    adresseDomiciliation?: {
      adresseComplete?: string | null;
      codePostal?: string | null;
      commune?: string | null;
      pays?: string | null;
    };
    paysResidence?: string | null;
    profession?: string | null;
    dateEntreeFonction?: string | null;
    dateSortieFonction?: string | null;
    fonction?: string | null;
    qualite?: string | null;
    fondateur?: boolean | null;
    personneMorale?: {
      type?: string | null;
      identifiant?: string | null;
      denomination?: string | null;
      pays?: string | null;
    } | null;
  }>;
  documents: Array<{
    id?: string;
    type?:
      | "Statuts"
      | "Comptes"
      | "Rapport d'activité"
      | "Procès verbal"
      | "Règlement intérieur"
      | "Acte notarié lié à une libéralité"
      | "Acte d'autorisation ou acte de non opposition"
      | "Courrier adressé par l'administration"
      | "Mise en demeure"
      | "Suspension"
      | "Décision de retrait / dissolution"
      | "Jugement de dissolution judiciaire";
    nomOriginal?: string | null;
    typeMime?: string | null;
    dateDepot?: string | null;
  }>;
  dossiers: {
    etatTransmissionComptes: "En règle" | "En défaut";
    exercicesComptablesTransmis: number[];
  };
  liensEntreOrganismes: {
    organismeIssuTransformation: {
      type: string;
      identifiant: string | null;
    } | null;
    organismeIssuFusion: {
      type: string;
      identifiant: string | null;
    } | null;
    organismesIssusScission: Array<{
      type?: string;
      identifiant?: string | null;
    }>;
  };
  situationFinanciere: {
    anneesSubventionsPubliques: number[];
    anneesAppelGenerositePublique: number[];
    anneesFinancementsEtrangers: number[];
  };
}
