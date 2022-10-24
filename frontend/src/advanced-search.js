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
          fetch('/api/localisation/' + value)
            .then((res) => res.json())
            .then((r) => {
              responsesContainer.innerHTML = '';
              console.log(r);
              r.map((el) => {
                const label = document.createElement('div');
                label.innerText = el.label;
                label.onclick = () => {
                  localisation.value = el.value;
                  form.submit();
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
