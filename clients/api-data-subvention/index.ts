import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import { ISubvention, ISubventions } from "#models/subventions/association";
import { IdRna, Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";
import { sensitiveRequestCallerInfos } from "#utils/network/utils/sensitive-request-caller-infos";
import { sensitiveRequestLogger } from "#utils/network/utils/sensitive-request-logger";

/**
 * Data Subvention
 * https://api.datasubvention.beta.gouv.fr/
 */
export const clientApiDataSubvention = async (
  siren: Siren | IdRna | string
): Promise<ISubventions> => {
  const route = routes.apiDataSubvention.grants(siren);

  const callerInfos = await sensitiveRequestCallerInfos();
  sensitiveRequestLogger(route, callerInfos);

  const data = await httpGet<any>(route, {
    headers: { "x-access-token": process.env.DATA_SUBVENTION_API_KEY },
    timeout: constants.timeout.XXXL,
  });

  const msgNotFound = `No subvention data found for : ${siren}`;

  if (!data.subventions || data.subventions.length === 0) {
    throw new HttpNotFound(msgNotFound);
  }

  const subventions = mapToDomainObject(data.subventions);

  if (subventions.length === 0) {
    throw new HttpNotFound(msgNotFound);
  }
  return subventions;
};

const mapToDomainObject = (grantItems: IGrantItem[]): ISubvention[] => {
  return grantItems
    .filter((grantItem) => Boolean(grantItem.application))
    .reduce((subventions: ISubvention[], grantItem) => {
      const year = grantItem.application.annee_demande?.value ?? 0;
      const label = grantItem.application.statut_label?.value ?? "";
      const status = grantItem.application.status?.value ?? "";
      const description = grantItem.application.dispositif?.value ?? "";
      const amount = grantItem.application.montants?.accorde?.value;

      const newSubvention: ISubvention = {
        year,
        label,
        status,
        description,
        amount,
      };

      return [...subventions, newSubvention];
    }, [])
    .sort((a, b) => b.year - a.year);
};
