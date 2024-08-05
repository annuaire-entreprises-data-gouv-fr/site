/**
 * Log an event in matomo, but from client side
 * @param action
 * @param category
 * @param label
 */
const logMatomoEvent = (category: string, action: string, label: string) => {
  var _paq = window._paq || [];
  _paq.push(['trackEvent', category, action, label]);
};

export const logConversionEvent = (label: string) => {
  if (typeof window !== 'undefined') {
    logMatomoEvent('conversion', label, window?.location.pathname);
  }
};
