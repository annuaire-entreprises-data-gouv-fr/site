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
// window.TallyConfig = {
//   formId: 'wMNx5k',
//   popup: {
//     emoji: {
//       text: '👋',
//       animation: 'wave',
//     },
//     open: {
//       trigger: 'time',
//       ms: 5000,
//     },
//   },
// };
