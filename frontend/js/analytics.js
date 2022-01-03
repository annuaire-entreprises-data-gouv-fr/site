(function () {
  window.logSearch = (searchTerms, resultCount) => {
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push([
        'trackEvent',
        'research:search',
        searchTerms,
        `resultCount=${resultCount}`,
      ]);
    }
  };

  window.logResultSelected = (
    selectedSiren,
    searchTerms,
    resultCount,
    position
  ) => {
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push([
        'trackEvent',
        'research:click',
        searchTerms,
        `selectedSiren:${selectedSiren}-position=${position}-page=${page}-resultCount=${resultCount}`,
      ]);
    }
  };
})();
