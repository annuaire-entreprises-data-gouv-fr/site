import { HttpNotFound } from "#/clients/exceptions";
import odsClient from "#/clients/open-data-soft";
import routes from "#/clients/routes";
import type { Siren } from "#/utils/helpers";
import type { IMarchePublic, IMarchePublicODSResponse } from "./interface";

const PAGE_SIZE = 20;

export const clientMarchePublic = async (
  siren: Siren,
  page = 1
): Promise<IMarchePublic> => {
  const response = await odsClient(
    {
      url: routes.marchePublic.ods.search,
      config: {
        params: {
          where: `startsWith(titulaire_id_1,"${siren}")`,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        },
      },
    },
    routes.marchePublic.ods.metadata,
    { page, pageSize: PAGE_SIZE }
  );

  if (response.records.length === 0) {
    throw new HttpNotFound(`No Marche Public record found for siren ${siren}`);
  }

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IMarchePublicODSResponse
): IMarchePublic => ({
  data: response.records.map((item) => ({
    codeCPV: item.codecpv,
    dateNotification: item.datenotification,
    marcheInnovant: item.marcheinnovant,
    montant: item.montant,
    nature: item.nature,
    objet: item.objet,
    procedure: item.procedure,
    titulaireId1: item.titulaire_id_1,
    titulaireId2: item.titulaire_id_2,
    titulaireId3: item.titulaire_id_3,
    titulaireTypeIdentifiant1: item.titulaire_typeidentifiant_1,
    titulaireTypeIdentifiant2: item.titulaire_typeidentifiant_2,
    titulaireTypeIdentifiant3: item.titulaire_typeidentifiant_3,
  })),
  meta: response.meta,
});
