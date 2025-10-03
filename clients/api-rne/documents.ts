import routes from "#clients/routes";
import constants from "#models/constants";
import { IDocumentsRNE } from "#models/rne/types";
import { Siren } from "#utils/helpers";
import { sensitiveRequestCallerInfos } from "#utils/network/utils/sensitive-request-caller-infos";
import { sensitiveRequestLogger } from "#utils/network/utils/sensitive-request-logger";
import { actesApiRneClient } from "./auth";

export const clientDocuments = async (
  siren: Siren,
  options?: { disableSensitiveRequestLogger?: boolean }
) => {
  const route = routes.inpi.api.rne.documents.list + siren + "/attachments";

  if (!options?.disableSensitiveRequestLogger) {
    const callerInfos = await sensitiveRequestCallerInfos();
    sensitiveRequestLogger(route, callerInfos);
  }

  const response = await actesApiRneClient.get<IDocumentsRNEResponse>(route, {
    timeout: constants.timeout.XXXL,
  });

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IDocumentsRNEResponse): IDocumentsRNE => {
  return {
    actes: (response?.actes || []).map((a) => {
      return {
        id: a.id || "",
        dateDepot: a.dateDepot || "",
        detailsDocuments:
          a?.typeRdd && a?.typeRdd.length > 0
            ? a?.typeRdd.map((t) => {
                return {
                  nom: t.typeActe,
                  label: t.decision,
                };
              })
            : [{ nom: a?.nomDocument, label: a?.libelle }],
      };
    }),
    bilans: (response?.bilans || []).map((a) => {
      return {
        id: a.id || "",
        dateDepot: a.dateDepot || "",
        dateCloture: a.dateCloture || "",
        typeBilan: a.typeBilan || "",
        confidentiality: a.confidentiality || "",
      };
    }),
    hasBilanConsolide:
      (response?.bilans || []).filter((b) => b.typeBilan === "K").length > 0,
  };
};
