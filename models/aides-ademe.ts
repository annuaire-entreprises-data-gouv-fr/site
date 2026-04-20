import { clientAidesADEME } from "#clients/api-data-gouv/aide-ademe";

export const getAidesADEME = (siren: string, params: { page?: number }) => {
  return clientAidesADEME(siren, params.page);
};
