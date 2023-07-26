/**
 * ASYNC CLIENT UPDATE FUNCTIONS
 *
 *
 */
import FrontStateMachineFactory from './front-state-machine';
import { extractSirenSlugFromUrl, formatIntFr } from './utils';

const route = 'https://ec.europa.eu/taxation_customs/vies/rest-api/ms/FR/vat/';

const tvaNumber = (siren) => {
  try {
    const tvaNumber = (12 + ((3 * parseInt(siren, 10)) % 97)) % 97;
    return `${tvaNumber < 10 ? '0' : ''}${tvaNumber}${siren}`;
  } catch {
    return '';
  }
};

(function TVA() {
  const tvaContainer = FrontStateMachineFactory('tva-cell-wrapper');
  if (tvaContainer.exists) {
    tvaContainer.setStarted();

    const siren = extractSirenSlugFromUrl(window.location.pathname || '');
    const tvaNumberFromSiren = tvaNumber(siren);

    if (!tvaNumberFromSiren) {
      throw new Error(`Failed to compute TVA number for siren ${siren}`);
    }

    const url = `${route}${tvaNumberFromSiren}`;
    fetch(url)
      .then((e) => {
        if (!e.ok) {
          throw new Error(e.status);
        }
        return e.json();
      })
      .then((response) => {
        const resultCell = document.getElementById('tva-cell-result');
        const tva = response.tva;
        if (tva) {
          resultCell.innerHTML = formatIntFr(tva);
          tvaContainer.setSuccess();
        } else {
          tvaContainer.setDefault();
        }
      })
      .catch((e) => {
        tvaContainer.setError();
        throw new Error('Failed to verify TVA number');
      });
  }
})();
