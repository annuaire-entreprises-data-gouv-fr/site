/**
 * ASYNC CLIENT UPDATE FUNCTIONS
 */
import FrontStateMachineFactory from './front-state-machine';
import { extractSirenSlugFromUrl, formatIntFr } from './utils';

(function TVA() {
  const logTVA = (siren, isValid) => {
    try {
      var _paq = window._paq || [];
      _paq.push(['trackEvent', 'tva', isValid ? 'valid' : 'invalid', siren]);
    } catch {}
  };

  const tvaContainer = FrontStateMachineFactory('tva-cell-wrapper');
  if (tvaContainer.exists) {
    tvaContainer.setStarted();

    const siren = extractSirenSlugFromUrl(window.location.pathname || '');

    fetch(`/api/data-fetching/verify-tva/${siren}`)
      .then((e) => {
        if (!e.ok) {
          throw new Error('Error in API TVA :' + e.status);
        }
        return e.json();
      })
      .then((response) => {
        const resultCell = document.getElementById('tva-cell-result');
        const tva = response.tva;
        if (tva) {
          resultCell.innerHTML = formatIntFr(tva);
          resultCell.style.marginRight = '75px';
          tvaContainer.setSuccess();
        } else {
          tvaContainer.setDefault();
        }

        if (Math.random() < 0.01) {
          logTVA(siren, !!tva);
        }
      })
      .catch((e) => {
        // We dont log errors, as they are already logged in the backend
        tvaContainer.setError();
        if (e instanceof TypeError) {
          throw new Error("Client error while fetching TVA", {cause : e});
        }
      });
  }
})();
