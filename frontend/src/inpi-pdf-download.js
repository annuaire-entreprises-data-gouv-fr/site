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
  throw new Error('INPI PDF Download : failed and redirected');
}

function handleNotFound() {
  throw new Error('INPI PDF Download : 404');
}
function wait(ttw) {
  return new Promise((resolve) => setTimeout(resolve, ttw));
}

async function download(url, siren) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return res.json().then(function (msg) {
        if (msg === 'Siren non existant') {
          return 404;
        } else {
          return 500;
        }
      });
    } else {
      const blob = await res.blob();
      saveAsPdf(blob, siren);
      return 200;
    }
  } catch (e) {
    console.info(e);
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
      // lets do nothing and retry
    }
    if (res === 200) {
      stateMachine.setSuccess();
    }
  };

  if (stateMachine.exists) {
    const siren = extractSirenSlugFromUrl(window.location.pathname || '');
    const url =
      'https://data.inpi.fr/export/companies?format=pdf&ids=[%22' +
      siren +
      '%22]';

    stateMachine.setStarted();

    if (window.fetch) {
      // first try
      console.info('first attempt');
      const res = await download(url, siren);
      handleResponse(res);

      // second try
      if (res === 500) {
        await wait(1 * 1000);

        console.info('second attempt');
        const res2 = await download(url, siren);
        handleResponse(res2);

        // third try
        if (res2 === 500) {
          await wait(3 * 1000);

          console.info('third attempt');
          const res3 = await download(url, siren);
          handleResponse(res3);

          if (res3 === 500) {
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
