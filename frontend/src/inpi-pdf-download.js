import FrontStateMachineFactory from './front-state-machine';
import { extractSirenSlugFromUrl } from './utils';

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

function handleError(msg) {
  throw new Error('Error while downloading INPI PDF');
}

function downloadInpiPDF() {
  const stateMachine = FrontStateMachineFactory(
    'immatriculation-pdf-status-wrapper'
  );

  if (stateMachine.exists) {
    const siren = extractSirenSlugFromUrl(window.location.pathname || '');
    stateMachine.setStarted();

    if (window.fetch) {
      const attemptDownload = () =>
        download(siren, stateMachine.setSuccess, stateMachine.setNotFound);
      // first try
      attemptDownload()
        // second try
        .catch((e) => {
          return attemptDownload();
        })
        // third try
        .catch((e) => {
          return attemptDownload();
        })
        // drop it
        .catch((e) => {
          stateMachine.setError();
          handleError();
        });
    } else {
      stateMachine.setError();
      handleError();
    }
  }
}

function download(
  siren,
  onSuccessCallback = function () {},
  onNotFoundCallback = function () {}
) {
  return fetch(
    'https://data.inpi.fr/export/companies?format=pdf&ids=[%22' + siren + '%22]'
  )
    .then((res) => {
      if (!res.ok) {
        res.json().then(function (msg) {
          if (msg === 'Siren non existant') {
            onNotFoundCallback();
          } else {
            throw new Error();
          }
          return;
        });
      } else {
        return res.blob();
      }
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
