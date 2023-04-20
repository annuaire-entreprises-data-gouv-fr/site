import odsClient from '#clients/open-data-soft';
import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import { organismeFormationDefaultField } from './default-field';
import {
  IOrganismesFormationRecord,
  IOrganismesFormationResponse,
} from './type';

export type IOrganismeFormation = {
  records: IOrganismesFormationRecord[];
  lastModified: string | null;
};

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

  const fields = response.records;
  const safetyRecords: IOrganismesFormationRecord[] = fields.map(
    (field: IOrganismesFormationResponse['records'][0]['fields']) => ({
      ...organismeFormationDefaultField,
      certification: field.certifications?.split('/'),
      ...field,
    })
  );
  return {
    records: safetyRecords,
    lastModified: response.lastModified,
  };
};
