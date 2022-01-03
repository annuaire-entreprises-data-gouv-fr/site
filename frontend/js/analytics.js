(function () {
  window.logSearch = (selectedSiren, searchTerms, resultCount, position) => {
    console.log(selectedSiren, searchTerms, resultCount, position);
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push([
        'trackEvent',
        'research',
        searchTerms,
        `selectedSiren:${selectedSiren}-position=${position}-page=${page}-resultCount=${resultCount}`,
      ]);
    }
  };
})();
