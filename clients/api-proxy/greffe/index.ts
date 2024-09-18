import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IUniteLegale, createDefaultUniteLegale } from '#models/core/types';
import { Siren } from '#utils/helpers';
import httpClient from '#utils/network';

type IAPIGreffeResponse = {
  nom: string; // 'ADECWATTS';
  numero_identification: string; // '925187106';
  etat: string; // 'ACTIVE';
  date_immatriculation: string; // '2024-06-10';
  activite_naf: {
    code: string; // '2640Z';
    libelle: string; // 'Fabrication de produits électroniques grand public';
  };
  date_radiation: string;
  type_personne:'PM'|'PP';
  jour_date_cloture: 31,
  mois_date_cloture: 12,
};

/**
 * Call EORI to validate a French EORI number
 * @param siret
 */
const clientUniteLegaleGreffe = async (siren: Siren): Promise<IUniteLegale> => {
  // return await clientAPIProxy<IEORIValidation>(routes.proxy.eori + siret, {
  //   timeout: constants.timeout.L,
  //   useCache: true,
  // });
  return mapToDomainObject(
    await httpClient<IAPIGreffeResponse>({
      url: routes.proxy.greffe + siren,
      useCache: false,
      timeout: constants.timeout.XXXL,
    }),
    siren
  );
};

const mapToDomainObject = (
  r: IAPIGreffeResponse,
  siren: Siren
): IUniteLegale => {
  const defaultUniteLegale = createDefaultUniteLegale(siren);
  return {
    ...defaultUniteLegale,
    immatriculation: {
      dateImmatriculation: r.date_immatriculation || '',
      dateRadiation: r.date_radiation || '',
      dateCloture: '',
      dateDebutActivite: '',
      dateFin: '',
      duree:'',
      isPersonneMorale:
    },
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientUniteLegaleGreffe,
});

export { stubbedClient as clientUniteLegaleGreffe };
