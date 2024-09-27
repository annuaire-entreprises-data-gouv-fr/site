import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import {
  IUniteLegale,
  createDefaultEtablissement,
  createDefaultUniteLegale,
} from '#models/core/types';
import { Siren, formatDateYear } from '#utils/helpers';
import { etatFromEtatAdministratifInsee } from '#utils/helpers/insee-variables';
import { clientAPIProxy } from '../client';

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
    dateDebutActivite: string;
    dateFin: string;
    duree: 0;
    natureEntreprise: string[];
    dateCloture: string;
    dateImmatriculation: string;
    dateRadiation: string;
    isPersonneMorale: boolean;
    capital: string;
  };
};

/**
 * Call EORI to validate a French EORI number
 * @param siret
 */
const clientUniteLegaleIG = async (siren: Siren): Promise<IUniteLegale> => {
  return mapToDomainObject(
    await clientAPIProxy<IIGResponse>(routes.proxy.ig + siren, {
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
    dateMiseAJourIG: formatDateYear(new Date()) || '',
    etatAdministratif: etatFromEtatAdministratifInsee(r.etat, r.siren),
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientUniteLegaleIG,
});

export { stubbedClient as clientUniteLegaleIG };
