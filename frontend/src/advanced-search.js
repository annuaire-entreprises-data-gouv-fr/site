/**
 * Display advanced seach on focus on search
 */

(function init() {
  const searchForm = document.getElementById('search-bar-form');
  const searchBar = document.getElementById('search-input-input');
  const searchContainer = document.getElementById('advanced-search-container');

  const show = () => {
    searchContainer.classList.add('show');
  };

  const hide = () => {
    searchContainer.classList.remove('show');
  };

  window.openAdvancedSearch = () => {
    searchBar.focus();
    show();
  };

  searchForm.addEventListener('focusin', () => {
    if (window.location.pathname !== '/') {
      show();
    }
  });

  document.addEventListener('click', (e) => {
    const targetClass = e.target.className || '';
    const isFilter = targetClass.indexOf('dont-close-advanced-search') > -1;
    const isInsideForm = searchForm.contains(e.target);
    if (!isFilter && !isInsideForm) {
      hide();
    }
  });
})();
