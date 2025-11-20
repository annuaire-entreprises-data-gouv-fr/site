type IFinessGeoItem = {
  nofinesset: string | null; // "010000024";
  nofinessej: string | null; // "010780054";
  rs: string | null; // "CH DE FLEYRIAT";
  rslongue: string | null; // "CENTRE HOSPITALIER DE BOURG-EN-BRESSE FLEYRIAT";
  complrs: string | null;
  compldistrib: string | null;
  numvoie: string | null; // "900";
  typvoie: string | null; // "RTE";
  voie: string | null; // "DE PARIS";
  compvoie: string | null;
  lieuditbp: string | null;
  commune: string | null; // "451";
  departement: string | null; // "01";
  libdepartement: string | null; // "AIN";
  ligneacheminement: string | null; // "01440 VIRIAT";
  telephone: string | null; // "0474454647";
  telecopie: string | null; // "0474454114";
  categetab: number; //355;
  libcategetab: string | null; // "Centre Hospitalier (C.H.)";
  categagretab: number; //1102;
  libcategagretab: string | null; // "Centres Hospitaliers";
  siret: string | null; // "26010004500012";
  codeape: string | null; // "8610Z";
  codemft: string | null; // "03";
  libmft: string | null; // "ARS \u00e9tablissements Publics de sant\u00e9 dotation globale";
  codesph: number; //1;
  libsph: string | null; // "Etablissement public de sant\u00e9";
  dateouv: string | null; // "1979-02-13";
  dateautor: string | null; // "1979-02-13";
  datemaj: string | null; // "2020-02-04";
  numuai: string | null;
  coordxet: number; //870262.2;
  coordyet: number; //6571540.8;
  sourcecoordet: string | null; // "1,ATLASANTE,96,BAN,L93_METROPOLE";
  datemaj_geoloc: string | null; // "2025-09-04";
};

type IFinessJuridiqueItem = {
  nofiness: string | null; // "010000156";
  rs: string | null; // "CLINIQUE CONVERT";
  rslongue: string | null; // "CLINIQUE CONVERT";
  complrs: string | null; //null;
  numvoie: string | null; // "62";
  typvoie: string | null; //AV;
  voie: string | null; // "DE JASSERON";
  compvoie: string | null; //null;
  compldistrib: string | null; //null;
  lieuditbp: string | null; //null;
  commune: string | null; // "053";
  ligneacheminement: string | null; // "01000 BOURG EN BRESSE";
  departement: string | null; // "01";
  libdepartement: string | null; //"AIN";
  telephone: string | null; // "0428631234";
  statutjuridique: string | null; // "73";
  libstatutjuridique: string | null; // "Société Anonyme (S.A.)";
  categetab: string | null; //null;
  libcategetab: string | null; //null;
  siren: string | null; // "772201489";
  codeape: string | null; // "8610Z";
  datecrea: string | null; // "2001-01-01";
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
