import React from 'react';

const DisplayNps = (
  <script
    dangerouslySetInnerHTML={{
      __html: `
    (function init() {
      window.showNPSModal = function () {
        var modal = document.getElementById('nps-modal');
        if (modal) {
          modal.style.display='block';
        }
      }
      window.closeNPSModal = function () {
        var modal = document.getElementById('nps-modal');
        if (modal) {
          modal.style.display='none';
        }
        window.localStorage.setItem('u', true);
      }
    })();

    (function triggerNPSModal() {
      try {
        var u = window.localStorage.getItem('u') || false;
        if(u) {
          return;
        }
        var data = window.sessionStorage.getItem('p') || 0;
        window.sessionStorage.setItem('p', parseInt(data,10)+1);

        var p = window.location.pathname;
        if((p.indexOf('/entreprise')===0 && data >= 2)
        || (p.indexOf('/rechercher')===0 && data >= 3)
        || (p.indexOf('/justificatif')===0 && data >= 2)
        || (p.indexOf('/etablissement')===0 && data >= 2)){
          window.showNPSModal();
        }
      } catch (e) {}
    })();
  `,
    }}
  />
);

export default DisplayNps;
