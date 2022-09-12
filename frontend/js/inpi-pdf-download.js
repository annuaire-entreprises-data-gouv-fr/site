import { extractSirenSlugFromUrl } from './utils';
import FrontStateMachineFactory from './front-state-machine';

function saveAsPdf(blob, siren) {
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.style = 'display: none';
  a.href = url;
  a.download = 'extrait_immatriculation_inpi_' + siren + '.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function downloadInpiPDF() {
  const stateMachine = FrontStateMachineFactory(
    'immatriculation-pdf-status-wrapper'
  );

  if (stateMachine.exists) {
    const siren = extractSirenSlugFromUrl();
    stateMachine.setStarted();

    window.setTimeout(function () {
      if (stateMachine.isStarted()) {
        stateMachine.setPending();
      }
    }, 10000);

    if (window.fetch) {
      download(siren, stateMachine.setSuccess)
        .catch((e) => {
          return download(siren, stateMachine.setSuccess);
        })
        .catch((e) => {
          return download(siren, stateMachine.setSuccess);
        })
        .catch((e) => {
          stateMachine.setError();
          throw e;
        });
    } else {
      stateMachine.setError();
      throw new Error('Download failed : browser too old');
    }
  }
}

function download(siren, onSuccessCallback = function () {}) {
  return fetch(
    'https://data.inpi.fr/export/companies?format=pdf&ids=[%22' + siren + '%22]'
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error('Download failed : Inpi is not answering');
      }
      return res.blob();
    })
    .then(function (blob) {
      saveAsPdf(blob, siren);
    })
    .then(onSuccessCallback);
}

(function init() {
  window.downloadInpiPDF = downloadInpiPDF;
  downloadInpiPDF();
})();
