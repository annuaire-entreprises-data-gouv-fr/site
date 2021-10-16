(function init() {
  window.showNPSModal = function () {
    var modal = document.getElementById('nps-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };
  window.closeNPSModal = function () {
    var modal = document.getElementById('nps-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    window.localStorage.setItem('u', true);
  };

  window.showWeNeedYouModal = function () {
    var modal = document.getElementById('we-need-you-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
    window.localStorage.setItem('u', true);
  };
  window.closeWeNeedYouModal = function () {
    var modal = document.getElementById('we-need-you-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };
})();

(function triggerNPSModal() {
  try {
    var p = window.location.pathname;

    var u = window.localStorage.getItem('u') || false;
    if (u || p === '/') {
      return;
    }

    // add a page-view counter
    var data = window.sessionStorage.getItem('p') || 0;
    window.sessionStorage.setItem('p', parseInt(data, 10) + 1);

    if (data >= 2) {
      window.showNPSModal();
    }

    if (
      (p.indexOf('/entreprise') === 0 && data >= 2) ||
      (p.indexOf('/rechercher') === 0 && data >= 3) ||
      (p.indexOf('/justificatif') === 0 && data >= 2) ||
      (p.indexOf('/annonces') === 0 && data >= 2) ||
      (p.indexOf('/etablissement') === 0 && data >= 2)
    ) {
      // window.showWeNeedYouModal();
    }
  } catch (e) {}
})();
