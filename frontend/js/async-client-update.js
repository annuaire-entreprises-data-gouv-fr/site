/**
 * ASYNC CLIENT UPDATE FUNCTIONS
 *
 *
 */

import FrontStateMachineFactory from './front-state-machine';
import { extractSirenSlugFromUrl, formatIntFr } from './utils';

(function TVA() {
  const tvaContainer = FrontStateMachineFactory('tva-cell-wrapper');
  if (tvaContainer.exists) {
    tvaContainer.setPending();

    const siren = extractSirenSlugFromUrl(window.location.pathname || '');

    fetch(`/api/verify-tva/${siren}`)
      .then((e) => e.json())
      .then((response) => {
        const resultCell = document.getElementById('tva-cell-result');
        const tva = response.tva;
        const result = tva ? formatIntFr(tva) : '<i>Non renseigné</i>';
        resultCell.innerHTML = result;
        tvaContainer.setSuccess();
      })
      .catch((e) => {
        tvaContainer.setError();
      });
  }
})();
