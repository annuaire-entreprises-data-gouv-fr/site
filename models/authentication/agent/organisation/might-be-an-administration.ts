/**
 * The orga belonging to following codes might be authorized to access espace agent but are not by default
 */

const codeJuridiquesThatMightBeAuthorized: string[] = [
  "4110",
  "4120",
  "4140",
  "4150",
  "7410",
  "5546",
  "5547",
  "5646",
  "5647",
  "6564",
  "6565",
  "6566",
  "6567",
  "7321",
  "7349",
  "7490",
  "8130",
  "8190",
  "8210",
  "8250",
  "8290",
  "8450",
  "8470",
  "8490",
  "8510",
  "8520",
];

/**
 * Code juridique that can be authorized to access espace agent upon legal case study
 * @param siret
 * @param idpId
 * @returns
 */
export const mightBeAnAuthorizedAdministration = (code: string) =>
  codeJuridiquesThatMightBeAuthorized.indexOf(code) > -1;
