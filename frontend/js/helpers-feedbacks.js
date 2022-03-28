/**
 *  NPS MODAL & FEEDBACK
 */
(function init() {
  window.showModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  };
  window.closeModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
    window.localStorage.setItem(modalId, true);
  };

  window.logResearchFeedback = function (value, searchTerm) {
    try {
      fetch(`/api/feedback/search-nps?value=${value}&searchTerm=${searchTerm}`);
    } catch {}

    window.closeModal('search-feedback');
  };
})();

function triggerModal(modalId, triggerCount = 1, startsWithString = '/') {
  var path = window.location.pathname;

  var hasAlreadyBeenTriggered = window.localStorage.getItem(modalId) || false;
  if (hasAlreadyBeenTriggered) {
    return;
  }

  if (path.indexOf(startsWithString) === -1) {
    return;
  }

  // page-view counter increment
  var pvKey = 'pv-' + modalId;
  var pageViewCount = window.sessionStorage.getItem(pvKey) || 0;

  if (pageViewCount >= triggerCount) {
    window.showModal(modalId);
  }

  window.sessionStorage.setItem(pvKey, parseInt(pageViewCount, 10) + 1);
}

triggerModal('nps-modal', 2, '/');
triggerModal('search-feedback', 2, '/rechercher');
// triggerModal('we-need-you-modal');
