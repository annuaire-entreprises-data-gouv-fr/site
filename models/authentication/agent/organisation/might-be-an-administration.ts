/**
 * The orga belonging to following codes might be authorized to access espace agent but are not by default
 */

const codeJuridiquesThatAreAdministrationButNotL100_3 = [
  '4110',
  '4120',
  '4140',
  '4150',
  '7381',
  '7410',
];

const codeJuridiquesThatMightBeAuthorized: string[] = [
  ...codeJuridiquesThatAreAdministrationButNotL100_3,
  '5546',
  '5547',
  '5646',
  '5647',
  '6564',
  '6565',
  '6566',
  '6567',
  '7321',
  '7349',
  '7490',
  '8130',
  '8190',
  '8210',
  '8250',
  '8290',
  '8450',
  '8470',
  '8490',
  '8510',
  '8520',
];

/**
 * administration but not in the L100-3 of CRPA article way
 *  */
export const isAdministrationButNotL100_3 = (code: string) => {
  if (codeJuridiquesThatAreAdministrationButNotL100_3.indexOf(code) > -1) {
    return true;
  }
  return false;
};

/**
 * Code juridique that can be authorized to access espace agent upon legal case study
 * @param siret
 * @param idpId
 * @returns
 */
export const mightBeAnAdministration = (code: string) => {
  return codeJuridiquesThatMightBeAuthorized.indexOf(code) > -1;
};
