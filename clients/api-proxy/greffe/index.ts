import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import {
  IUniteLegale,
  createDefaultEtablissement,
  createDefaultUniteLegale,
} from '#models/core/types';
import { Siren } from '#utils/helpers';
import { etatFromEtatAdministratifInsee } from '#utils/helpers/insee-variables';
import httpClient from '#utils/network';

type IIGResponse = {
  siren: Siren;
  nomComplet: string;
  etat: string;
  natureJuridique: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  siege: string;
  association: {
    idAssociation: string | null;
  };
  immatriculation: {
    dateImmatriculation: string;
    dateRadiation: string;
    dateDebutActiv: string;
    dateCessationActivite: string;
    isPersonneMorale: boolean;
    denomination: string;
    natureEntreprise: string;
    dateClotureExercice: string;
    dureePersonneMorale: number;
    capital: string;
    libelleNatureJuridique: string;
  };
};

/**
 * Call EORI to validate a French EORI number
 * @param siret
 */
const clientUniteLegaleIG = async (siren: Siren): Promise<IUniteLegale> => {
  return mapToDomainObject(
    await httpClient<IIGResponse>({
      url: routes.proxy.ig + siren,
      useCache: false,
      timeout: constants.timeout.XL,
    }),
    siren
  );
};

const mapToDomainObject = (r: IIGResponse, siren: Siren): IUniteLegale => {
  const defaultUniteLegale = createDefaultUniteLegale(siren);
  return {
    ...defaultUniteLegale,
    ...r,
    siege: createDefaultEtablissement(),
    etatAdministratif: etatFromEtatAdministratifInsee(r.etat, r.siren),
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientUniteLegaleIG,
});

export { stubbedClient as clientUniteLegaleIG };
