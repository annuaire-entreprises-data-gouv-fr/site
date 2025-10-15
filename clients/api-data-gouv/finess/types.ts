type IFinessGeoItem = {
  nofinesset: string | null; //"010000024";
  nofinessej: string | null; //"010780054";
  RaisonSociale: string | null; //"CH DE FLEYRIAT";
  RaisonSocialeLongue: string | null; //"CENTRE HOSPITALIER DE BOURG-EN-BRESSE FLEYRIAT";
  ComplementRaisonSociale: string | null; //null;
  ComplementDistribution: string | null; //null;
  NumeroVoie: string | null; //"900";
  TypeVoie: string | null; //RTE;
  LibelleVoie: string | null; //"DE PARIS";
  ComplementVoie: string | null; //null;
  LieuDitBp: string | null; //null;
  Commune: string | null; //"451";
  Departement: string | null; //"01";
  LibelleDepartement: string | null; //AIN;
  LigneAcheminement: string | null; //"01440 VIRIAT";
  Telephone: string | null; //"0474454647";
  Telecopie: string | null; //"0474454114";
  Categorie: number | null; //355;
  LibelleCategorie: string | null; //"Centre Hospitalier (C.H.)";
  CategorieAgregat: number | null; //1102;
  LibelleCategorieAgregat: string | null; //"Centres Hospitaliers";
  Siret: string | null; //"26010004500012";
  CodeApe: string | null; //"8610Z";
  CodeMft: string | null; //"03";
  LibelleMft: string | null; //"ARS établissements Publics de santé dotation globale";
  CodeSph: number | null; //1;
  LibelleSph: string | null; //"Etablissement public de santé";
  DateOuverture: string | null; //"1979-02-13";
  DateAutorisation: string | null; //"1979-02-13";
  DateMajStructure: string | null; //"2020-02-04";
  NumeroUAI: string | null; //null;
  Emetteur: string | null; //null;
  coordxet: number | null; //870262.2;
  coordyet: number | null; //6571540.8;
  sourcecoordet: string | null; //"1,ATLASANTE,96,BAN,L93_METROPOLE";
  datemaj: string | null; //"2025-09-04";
};

type IFinessJuridiqueItem = {
  nofinesset: string | null; //"010000024";
  nofinessej: string | null; //"010780054";
  RaisonSociale: string | null; //"CH DE FLEYRIAT";
  RaisonSocialeLongue: string | null; //"CENTRE HOSPITALIER DE BOURG-EN-BRESSE FLEYRIAT";
  ComplementRaisonSociale: string | null; //null;
  ComplementDistribution: string | null; //null;
  NumeroVoie: string | null; //"900";
  TypeVoie: string | null; //RTE;
  LibelleVoie: string | null; //"DE PARIS";
  ComplementVoie: string | null; //null;
  LieuDitBp: string | null; //null;
  Commune: string | null; //"451";
  Departement: string | null; //"01";
  LibelleDepartement: string | null; //AIN;
  LigneAcheminement: string | null; //"01440 VIRIAT";
  Telephone: string | null; //"0474454647";
  Telecopie: string | null; //"0474454114";
  Categorie: number | null; //355;
  LibelleCategorie: string | null; //"Centre Hospitalier (C.H.)";
  CategorieAgregat: number | null; //1102;
  LibelleCategorieAgregat: string | null; //"Centres Hospitaliers";
  Siret: string | null; //"26010004500012";
  CodeApe: string | null; //"8610Z";
  CodeMft: string | null; //"03";
  LibelleMft: string | null; //"ARS établissements Publics de santé dotation globale";
  CodeSph: number | null; //1;
  LibelleSph: string | null; //"Etablissement public de santé";
  DateOuverture: string | null; //"1979-02-13";
  DateAutorisation: string | null; //"1979-02-13";
  DateMajStructure: string | null; //"2020-02-04";
  NumeroUAI: string | null; //null;
  Emetteur: string | null; //null;
  coordxet: number | null; //870262.2;
  coordyet: number | null; //6571540.8;
  sourcecoordet: string | null; //"1,ATLASANTE,96,BAN,L93_METROPOLE";
  datemaj: string | null; //"2025-09-04";
};

type IFinessJuridiqueDatagouvResponse = {
  data: IFinessJuridiqueItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
};

type IFinessGeoDatagouvResponse = {
  data: IFinessGeoItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
};
