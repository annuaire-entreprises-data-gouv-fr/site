/**
 * Display advanced seach on focus on search
 */

(function init() {
  const searchForm = document.getElementById('search-bar-form');
  const searchBar = document.getElementById('search-input-input');

  const advancedSearchToggle = document.getElementById(
    'toggle-advanced-search'
  );

  window.openAdvancedSearch = () => {
    searchBar.focus();
    advancedSearchToggle.checked = true;
  };

  searchForm.addEventListener('focusin', () => {
    if (window.location.pathname !== '/') {
      advancedSearchToggle.checked = true;
    }
  });

  document.addEventListener('click', (e) => {
    const isFilter =
      e.target.className.indexOf('dont-close-advanced-search') > -1;
    const isInsideForm = searchForm.contains(e.target);
    if (!isFilter && !isInsideForm) {
      advancedSearchToggle.checked = false;
    }
  });
})();
