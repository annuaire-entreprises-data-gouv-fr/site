/**
 * Display advanced seach on focus on search
 */

(function init() {
  // show filters
  const filtersContainer = document.getElementById('search-filters-container');
  if (filtersContainer) {
    filtersContainer.style.display = 'block';

    const form = document.getElementById('search-bar-form');

    if (form) {
      const localisation = document.getElementById('search-localisation');
      const responsesContainer = document.getElementById(
        'search-localisation-responses'
      );

      localisation.addEventListener('input', () => {
        // gérer le debounce
        const value = localisation.value;
        if (value.length >= 2) {
          fetch('/api/geo/' + value)
            .then((res) => res.json())
            .then((r) => {
              responsesContainer.innerHTML = '';
              r.map((el) => {
                const label = document.createElement('div');
                label.className = 'cursor-pointer';
                label.style.padding = '8px 0';
                label.style.borderBottom = '1px solid #efefef';
                label.innerText = el.label;
                label.onclick = () => {
                  localisation.value = el.value;
                  responsesContainer.innerHTML = '';
                };
                responsesContainer.appendChild(label);
              });
            })
            .catch();
        }
      });
    }
  }
})();
