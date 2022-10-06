/**
 * Display advanced seach on focus on search
 */

(function init() {
  const searchBar = document.getElementById('search-bar-form');
  const advancedSearchToggle = document.getElementById(
    'toggle-advanced-search'
  );

  searchBar.addEventListener('focusin', (e) => {
    console.log('focusin');
    advancedSearchToggle.checked = true;
  });

  document.addEventListener('click', (e) => {
    const isInsideForm = searchBar.contains(e.target);
    if (!isInsideForm) {
      advancedSearchToggle.checked = false;
    }
  });
})();
