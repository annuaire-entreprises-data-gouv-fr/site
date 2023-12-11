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

class PDFDownloadException extends Error {
  name = 'PDFDownloadException';
}

function handleError() {
  throw new PDFDownloadException('Failed and redirected');
}

function handleNotFound() {
  throw new PDFDownloadException('Not found - 404');
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
      const res = await download(url, siren);
      handleResponse(res);

      if (res === 200) {
        stateMachine.setSuccess();
      }
      if (res === 404) {
        stateMachine.setNotFound();
        handleNotFound();
      }
      if (res === 500) {
        // nevermind - it was a bad idea anyway
        stateMachine.setError();
        document.getElementById('download-pdf-link').click();
        handleError();
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
