export interface IMarchePublicODSItem {
  acheteur_id: string;
  attributionavance: string;
  ccag: string;
  codecpv: string;
  considerationsenvironnementales: string;
  considerationssociales: string;
  datenotification: string;
  datenotificationactesoustraitance: string;
  datenotificationmodificationmodification: string;
  datenotificationmodificationsoustraitancemodificationactesoustraitance: string;
  datepublicationdonnees: string;
  datepublicationdonneesactesoustraitance: string;
  datepublicationdonneesmodificationactesoustraitance: string;
  datepublicationdonneesmodificationmodification: string;
  dureemois: number;
  dureemoisactesoustraitance: string;
  dureemoismodification: string;
  dureemoismodificationactesoustraitance: string;
  formeprix: string;
  id: string;
  idaccordcadre: string;
  idactesoustraitance: string;
  idmodification: string;
  idmodificationactesoustraitance: string;
  idsoustraitant: string;
  idtitulairemodification: string;
  lieuexecution_code: string;
  lieuexecution_typecode: string;
  marcheinnovant: string;
  modalitesexecution: string;
  montant: number;
  montantactesoustraitance: string;
  montantmodification: string;
  montantmodificationactesoustraitance: string;
  nature: string;
  objet: string;
  offresrecues: string;
  originefrance: string;
  origineue: string;
  procedure: string;
  source: string;
  soustraitancedeclaree: string;
  tauxavance: string;
  techniques: string;
  titulaire_id_1: string;
  titulaire_id_2: string;
  titulaire_id_3: string;
  titulaire_typeidentifiant_1: string;
  titulaire_typeidentifiant_2: string;
  titulaire_typeidentifiant_3: string;
  typegroupementoperateurs: string;
  typeidentifiantsoustraitant: string;
  typeidentifianttitulairemodification: string;
  typesprix: string;
  variationprixactesoustraitance: string;
}

export interface IMarchePublicODSResponse {
  lastModified: string | null;
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
  records: IMarchePublicODSItem[];
}

export interface IMarchePublicItem {
  codeCPV: string;
  dateNotification: string;
  marcheInnovant: string;
  montant: number;
  nature: string;
  objet: string;
  procedure: string;
  titulaireId1: string;
  titulaireId2: string;
  titulaireId3: string;
  titulaireTypeIdentifiant1: string;
  titulaireTypeIdentifiant2: string;
  titulaireTypeIdentifiant3: string;
}

export interface IMarchePublic {
  data: IMarchePublicItem[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
