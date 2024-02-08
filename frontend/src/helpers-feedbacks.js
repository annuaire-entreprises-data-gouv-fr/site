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
      window.localStorage.setItem(modalId, new Date().getTime().toString());
    } catch {}
  };
}

function triggerModal(
  modalId,
  triggerCount = 1,
  startsWithString = '/',
  monthPeriodReset = 6
) {
  var path = window.location.pathname;

  try {
    var lastTriggerTimestamp = window.localStorage.getItem(modalId);
    if (lastTriggerTimestamp) {
      var diffInMonths =
        (new Date().getTime() - parseInt(lastTriggerTimestamp, 10)) /
        (1000 * 60 * 60 * 24 * 30);
      if (diffInMonths > monthPeriodReset) {
        // after X month, reset
        window.localStorage.removeItem(modalId);
      } else {
        return;
      }
    }
  } catch (e) {
    // no access to local storage. Probably for privacy reason. We choose not to show modal rather than showing it on every visit
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
  triggerModal('nps-modal-2', 2, '/', 6);
}
