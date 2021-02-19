/**
 * API SIRENE by INSEE
 *
 * This route calls the official INSEE API, that has several limitations :
 * instable + not many concurrent request allowed.
 *
 * The idea is to only call it when the Etalab SIRENE does not answer :
 * - API Etalab is down
 * - requested company is non-diffusible
 * - requested company is very recent and API Etalab is not yet up to dat
 * - requested company does not exist
 *
 * IN all three first cases, API SIRENE by INSEE can answer, and we map the answer to the UniteLegale type
 *
 */

const inseeAuth = async () => {
  const clientId = process.env.INSEE_CLIENT_ID;
  const clientSecret = process.env.INSEE_CLIENT_SECRET;
  const response = await fetch(routes.sireneInsee.auth, {
    method: 'POST',
    body:
      'grant_type=client_credentials&client_id=' +
      clientId +
      '&client_secret=' +
      clientSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  try {
    return response.json();
  } catch (e) {
    logErrorInSentry(response.text());
    return undefined;
  }
};
