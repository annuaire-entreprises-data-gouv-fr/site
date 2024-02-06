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
      window.localStorage.setItem(modalId, new Date().toISOString());
    } catch (e) {}
  };
}

function triggerModal(
  modalId,
  triggerCount = 1,
  startsWithString = '/',
  periodicity = undefined
) {
  var path = window.location.pathname;

  var hasAlreadyBeenTriggered;
  try {
    hasAlreadyBeenTriggered = window.localStorage.getItem(modalId);
  } catch (e) {
    hasAlreadyBeenTriggered = 'true';
  }
  if (hasAlreadyBeenTriggered === 'true') {
    if (periodicity) {
      try {
        window.localStorage.setItem(modalId, new Date().toISOString());
      } catch (e) {}
    }
    return;
  }

  if (periodicity) {
    try {
      var lastTime = window.localStorage.getItem(modalId);
      if (lastTime) {
        var lastTimeDate = new Date(lastTime);
        var currentTime = new Date();
        var diffInMonths =
          (currentTime - lastTimeDate) / (1000 * 60 * 60 * 24 * 30);
        if (diffInMonths < periodicity) {
          return;
        }
      }
    } catch (e) {}
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
  triggerModal('nps-modal', 2, '/', 6);
}

// triggerModal('we-need-you-modal', 0, '/');
