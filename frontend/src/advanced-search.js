/**
 * Display advanced seach on focus on search
 */

function debounce(func, timeout = 180) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function completeGeoSearch(localisationInput) {
  const responsesContainer = document.getElementById(
    'search-localisation-responses'
  );

  if (!isNaN(localisationInput.value)) {
    return;
  }

  if (localisationInput.value.length >= 2) {
    responsesContainer.innerHTML = `<br/><i>...recherche de suggestions</i>`;
    fetch('/api/geo/' + localisationInput.value)
      .then((res) => res.json())
      .then((r) => {
        responsesContainer.innerHTML = '';
        if (r && r.length === 0) {
          responsesContainer.innerHTML = `<br/><i>Nous n’avons trouvé aucune ville ou département correspondant à votre recherche.</i>`;
        } else {
          r.map((el) => {
            const label = document.createElement('div');
            label.className = 'cursor-pointer';
            label.style.padding = '8px 0';
            label.style.borderBottom = '1px solid #efefef';
            label.innerText = el.label;
            label.onclick = () => {
              localisationInput.value = el.value;
              responsesContainer.innerHTML = '';
            };
            responsesContainer.appendChild(label);
          });
        }
      })
      .catch(() => {
        responsesContainer.innerHTML = `<br/><b>Notre moteur de suggestion est actuellement indisponible.<br/>Vous pouvez cependant saisir directement le code postal ou le code département.</b>`;
      });
  }
}

(function init() {
  // show filters
  const filtersContainer = document.getElementById('search-filters-container');
  if (filtersContainer) {
    filtersContainer.style.display = 'block';

    const form = document.getElementById('search-bar-form');

    if (form) {
      const localisationInput = document.getElementById(
        'search-localisation-input'
      );

      localisationInput.addEventListener(
        'input',
        debounce(() => completeGeoSearch(localisationInput))
      );

      localisationInput.addEventListener('keydown', (event) => {
        // prevent submit on enter as input content is not valid dep or cp code
        if (event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });

      const applyButton = filtersContainer.querySelector('button');
      applyButton.onclick = (e) => {
        localisationInput.setCustomValidity('');
        if (isNaN(localisationInput.value)) {
          localisationInput.setCustomValidity(
            'Veuillez selectionner une ville ou un département dans la liste de suggestions, ou bien saisir directement le code postal ou le code département.'
          );
        }
      };
    }
  }
})();
