/**
 *  NPS MODAL
 */
function init() {
  window.showModal = function (modalId) {
    var modal = document.getElementById(modalId);

    if (modal) {
      modal.style.display = 'block';
      window.setTimeout(() => modal.classList.toggle('hide'), 400);
    }
  };
  window.closeModal = function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
    try {
      window.localStorage.setItem(modalId, true);
    } catch (e) {}
  };
}

function triggerModal(modalId, triggerCount = 1, startsWithString = '/') {
  var path = window.location.pathname;

  var hasAlreadyBeenTriggered;
  try {
    hasAlreadyBeenTriggered = window.localStorage.getItem(modalId) || false;
  } catch (e) {
    hasAlreadyBeenTriggered = true;
  }
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

if (typeof window !== 'undefined') {
  init();
  triggerModal('nps-modal', 2, '/');
}

// triggerModal('we-need-you-modal', 0, '/');
