function getSirenAndName(path) {
  if (!path) {
    return '';
  }

  var match = path.match(/\d{9}/g);
  if (typeof match !== 'undefined') {
    var siren = match[match.length - 1];
    var name = document.getElementsByTagName('h1')[0].innerText;
    return { siren, name, path };
  }
  return '';
}

function init() {
  var localStorageKey = 'favourites-siren';
  try {
    var path = window.location.pathname;
    if (path.indexOf('/entreprise') !== 0) {
      return;
    }

    var favourites = window.localStorage.getItem(localStorageKey);
    if (favourites) {
      favourites = JSON.parse(favourites);
    } else {
      favourites = [];
    }

    var visit = getSirenAndName(path);
    var newFavourites = [visit];
    for (var i = 0; i < Math.min(favourites.length, 3); i++) {
      if (favourites[i].siren !== visit.siren) {
        newFavourites.push(favourites[i]);
      }
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(newFavourites));
  } catch (e) {
    console.error(e);
  }
}

if (typeof window !== 'undefined') {
  init();
}
