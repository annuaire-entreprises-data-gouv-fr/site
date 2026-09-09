export interface IFondationsRestreintes {
  conformiteComptable: {
    etatTransmissionComptes: "En règle" | "En défaut";
    anneesExercicesComptablesTransmis: number[];
  };
  dirigeants: Array<{
    nom?: string | null;
    prenom?: string | null;
    fonction?: string | null;
    qualite?: string | null;
    dateNaissance?: string | null;
    nationalite?: string | null;
    paysResidence?: string | null;
    profession?: string | null;
    dateEntreeFonction?: string | null;
    dateSortieFonction?: string | null;
    fondateur?: boolean | null;
    adresseDomiciliation?: {
      adresseComplete?: string | null;
      complement?: string | null;
      numeroVoie?: string | null;
      typeVoie?: string | null;
      libelleVoie?: string | null;
      distribution?: string | null;
      codeInsee?: string | null;
      codePostal?: string | null;
      commune?: string | null;
      pays?: string | null;
    };
    personneMorale?: {
      type?: string | null;
      identifiant?: string | null;
      nom?: string | null;
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
  filiation: Array<{
    typeOperation?: "Transformation" | "Fusion" | "Scission";
    identifiant?: string | null;
  }>;
  situationFinanciere: {
    anneesSubventionsPubliques: number[];
    anneesAppelGenerositePublique: number[];
    anneesFinancementsEtrangers: number[];
  };
}
