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

function handleError() {
  throw new Error('INPI PDF Download : 500');
}

function handleNotFound() {
  throw new Error('INPI PDF Download : 404');
}
function wait(ttw) {
  return new Promise((resolve) => setTimeout(resolve, ttw));
}

async function download(siren) {
  try {
    const res = await fetch(
      'https://data.inpi.fr/export/companies?format=pdf&ids=[%22' +
        siren +
        '%22]'
    );

    if (!res.ok) {
      return res.json().then(function (msg) {
        if (msg === 'Siren non existant') {
          return 404;
        } else {
          return 500;
        }
      });
    } else {
      const blob = res.blob();
      saveAsPdf(blob, siren);
      return 200;
    }
  } catch (e) {
    return 500;
  }
}

async function downloadInpiPDF() {
  const stateMachine = FrontStateMachineFactory(
    'immatriculation-pdf-status-wrapper'
  );

  const handleResponse = (res) => {
    if (res === 404) {
      stateMachine.setNotFound();
      handleNotFound();
    }
    if (res === 500) {
      stateMachine.setError();
      handleError();
    }
    if (res === 200) {
      stateMachine.setSuccess();
    }
  };

  if (stateMachine.exists) {
    const siren = extractSirenSlugFromUrl(window.location.pathname || '');
    stateMachine.setStarted();

    if (window.fetch) {
      // first try
      const res = await download(siren);
      handleResponse(res);

      // second try
      if (res !== 200) {
        const res2 = await download(siren);
        handleResponse(res2);

        // third try
        if (res2 !== 200) {
          await wait(30 * 1000);
          const res3 = await download(siren);
          handleResponse(res3);

          if (res3 !== 200) {
            // nevermind - it was a bad idea anyway
            stateMachine.setError();
            handleError();
          }
        }
      }
    } else {
      stateMachine.setError();
      handleError();
    }
  }
}

(function init() {
  window.downloadInpiPDF = downloadInpiPDF;
  downloadInpiPDF();
})();
