import odsClient from "#clients/open-data-soft";
import routes from "#clients/routes";
import type { IOrganismeFormation } from "#models/certifications/organismes-de-formation";
import type { Siren } from "#utils/helpers";
import type { IOrganismesFormationRecord } from "./type";

/**
 * MTPEI - DGEFP
 * https://dgefp.opendatasoft.com/explore/dataset/liste-publique-des-of-v2/information/
 */
export const clientOrganismeFormation = async (
  siren: Siren
): Promise<IOrganismeFormation> => {
  const response = await odsClient(
    {
      url: routes.dgefp.search,
      config: { params: { q: siren } },
    },
    routes.dgefp.metadata
  );

  const fields = response.records as IOrganismesFormationRecord[];
  return {
    records: fields.map(mapToDomainObject),
    qualiopiCertified: !!fields.find(
      (f) => (f?.certifications || []).length > 0
    ),
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (record: IOrganismesFormationRecord) => ({
  nda: record.numerodeclarationactivite || null,
  exNda: record.numerosdeclarationactiviteprecedent || null,
  region: record.reg_name || null,
  dateDeclaration: record.informationsdeclarees_datedernieredeclaration || null,
  specialite: record.toutes_specialites,
  stagiaires: record.informationsdeclarees_nbstagiaires || null,
  formateurs: record.informationsdeclarees_effectifformateurs || null,
  certifications: record.certifications
    ? (record.certifications || "").split("/")
    : [],
});
