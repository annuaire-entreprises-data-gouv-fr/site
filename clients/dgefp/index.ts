import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { organismeFormationDefaultField } from './default-field';
import { IOrganismesFormationResponse } from './type';

/**
 * MTPEI - DGEFP
 * https://dgefp.opendatasoft.com/explore/dataset/liste-publique-des-of-v2/information/
 */
export const clientDGEFP = async (siren: Siren) => {
  const route = routes.dgefp;
  const response = await httpGet(route, { params: { q: `siren:${siren}` } });
  const data = response.data as IOrganismesFormationResponse;
  const safetyRecords: IOrganismesFormationResponse['records'] =
    data.records.map((record) => ({
      ...record,
      fields: {
        ...organismeFormationDefaultField,
        ...record.fields,
      },
    }));
  return {
    ...data,
    ...safetyRecords,
  };
};
