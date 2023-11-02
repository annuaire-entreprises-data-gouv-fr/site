import routes from '#clients/routes';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { IFondation } from '#models/fondations';
import { IdRnf } from '#utils/helpers/id-rnf';
import { httpGet } from '#utils/network';

type IRNFResponse = {
  createdAt: string;
  updatedAt: string;
  rnfId: string; //"075-FDD-00003-01"
  type: string;
  department: string;
  title: string;
  dissolvedAt: string | null;
  phone: string;
  email: string;
  address: {
    createdAt: string;
    updatedAt: string;
    label: string;
    type: string;
    streetAddress: string;
    streetNumber: string;
    streetName: string;
    postalCode: string;
    cityName: string;
    cityCode: string;
    departmentName: string;
    departmentCode: string;
    regionName: string;
    regionCode: string;
  };
  status: unknown;
  persons: unknown[];
};

/**
 * Call RNF API using an Id RNF
 * @param idRnf
 */
const clientRNF = async (idRnf: IdRnf, useCache = true) => {
  const url = `${routes.rnf}${idRnf}`;
  const response = await httpGet<IRNFResponse>(url, { useCache });

  return mapToDomainObject(idRnf, response);
};

const mapToDomainObject = (
  idRnf: IdRnf,
  response: IRNFResponse
): IFondation => {
  const {
    title,
    dissolvedAt,
    address,
    department,
    type,
    createdAt,
    phone,
    email,
  } = response;

  return {
    idRnf,
    nomComplet: title,
    etatAdministratif: !dissolvedAt
      ? IETATADMINSTRATIF.ACTIF
      : IETATADMINSTRATIF.CESSEE,
    adresse: address.label,
    departement: department,
    type,
    dateCreation: createdAt.split('T')[0],
    dateFermeture: (dissolvedAt || '').split('T')[0],
    telephone: phone,
    email,
  };
};

export { clientRNF };
