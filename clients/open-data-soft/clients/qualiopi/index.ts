import odsClient from '#clients/open-data-soft';
import routes from '#clients/routes';
import { stubClient } from '#clients/stub-client-with-snaphots';
import { IOrganismeFormation } from '#models/certifications/organismes-de-formation';
import { Siren } from '#utils/helpers';
import { IOrganismesFormationRecord } from './type';

/**
 * MTPEI - DGEFP
 * https://dgefp.opendatasoft.com/explore/dataset/liste-publique-des-of-v2/information/
 */
const clientOrganismeFormation = async (
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
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (record: IOrganismesFormationRecord) => {
  return {
    nda: record.numerodeclarationactivite || null,
    exNda: record.numerosdeclarationactiviteprecedent || null,
    region: record.reg_name || null,
    dateDeclaration:
      record.informationsdeclarees_datedernieredeclaration || null,
    specialite: record.toutes_specialites,
    stagiaires: record.informationsdeclarees_nbstagiaires || null,
    formateurs: record.informationsdeclarees_effectifformateurs || null,
    certifications: record.certifications
      ? (record.certifications || '').split('/')
      : [],
  };
};

const stubbedClientOrganismeFormation = stubClient({
  clientOrganismeFormation,
});

export { stubbedClientOrganismeFormation as clientOrganismeFormation };
