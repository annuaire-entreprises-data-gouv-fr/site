interface IFinessGeoItem {
  categagretab: number; //1102;
  categetab: number; //355;
  codeape: string | null; // "8610Z";
  codemft: string | null; // "03";
  codesph: number; //1;
  commune: string | null; // "451";
  compldistrib: string | null;
  complrs: string | null;
  compvoie: string | null;
  coordxet: number; //870262.2;
  coordyet: number; //6571540.8;
  dateautor: string | null; // "1979-02-13";
  datemaj: string | null; // "2020-02-04";
  datemaj_geoloc: string | null; // "2025-09-04";
  dateouv: string | null; // "1979-02-13";
  departement: string | null; // "01";
  libcategagretab: string | null; // "Centres Hospitaliers";
  libcategetab: string | null; // "Centre Hospitalier (C.H.)";
  libdepartement: string | null; // "AIN";
  libmft: string | null; // "ARS \u00e9tablissements Publics de sant\u00e9 dotation globale";
  libsph: string | null; // "Etablissement public de sant\u00e9";
  lieuditbp: string | null;
  ligneacheminement: string | null; // "01440 VIRIAT";
  nofinessej: string | null; // "010780054";
  nofinesset: string | null; // "010000024";
  numuai: string | null;
  numvoie: string | null; // "900";
  rs: string | null; // "CH DE FLEYRIAT";
  rslongue: string | null; // "CENTRE HOSPITALIER DE BOURG-EN-BRESSE FLEYRIAT";
  siret: string | null; // "26010004500012";
  sourcecoordet: string | null; // "1,ATLASANTE,96,BAN,L93_METROPOLE";
  telecopie: string | null; // "0474454114";
  telephone: string | null; // "0474454647";
  typvoie: string | null; // "RTE";
  voie: string | null; // "DE PARIS";
}

interface IFinessJuridiqueItem {
  categetab: string | null; //null;
  codeape: string | null; // "8610Z";
  commune: string | null; // "053";
  compldistrib: string | null; //null;
  complrs: string | null; //null;
  compvoie: string | null; //null;
  datecrea: string | null; // "2001-01-01";
  departement: string | null; // "01";
  libcategetab: string | null; //null;
  libdepartement: string | null; //"AIN";
  libstatutjuridique: string | null; // "Société Anonyme (S.A.)";
  lieuditbp: string | null; //null;
  ligneacheminement: string | null; // "01000 BOURG EN BRESSE";
  nofiness: string | null; // "010000156";
  numvoie: string | null; // "62";
  rs: string | null; // "CLINIQUE CONVERT";
  rslongue: string | null; // "CLINIQUE CONVERT";
  siren: string | null; // "772201489";
  statutjuridique: string | null; // "73";
  telephone: string | null; // "0428631234";
  typvoie: string | null; //AV;
  voie: string | null; // "DE JASSERON";
}

interface IFinessJuridiqueDatagouvResponse {
  data: IFinessJuridiqueItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
}

interface IFinessGeoDatagouvResponse {
  data: IFinessGeoItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
}
