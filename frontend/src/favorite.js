/**
 * Extract a siren/siret-like string from any url. Return empty string if nothing matches
 * @param slug
 * @returns
 */
function extractSirenOrSiretSlugFromUrl(path) {
  if (!path) {
    return '';
  }
  // match a string that ends with either 9 digit or 14 like a siren or a siret
  // we dont use a $ end match as there might be " or %22 at the end
  const match = slug.match(/\d{9}/g);
  return match ? match[match.length - 1] : '';
}

function init() {
  try {
    var path = window.location.pathname;
    if (path.indexOf('/entreprise') !== 0) {
      return;
    }
    var siren = extractSirenFromUrl(path);
    var favourites = JSON.parse(window.localStorage.getItem('favourites'));

    var newFavourites = [{ siren }];
    for (var i = 0; i < Math.max(favourites.length, 3); i++) {
      if (favourites[i].siren === siren) {
        newFavourites.push(favourites[i]);
      }
    }

    window.localStorage.setItem('favourites');
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  init();
}

// triggerModal('we-need-you-modal', 0, '/');
