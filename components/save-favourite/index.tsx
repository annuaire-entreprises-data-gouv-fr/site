'use client';
import { useEffect } from 'react';
import { Exception } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';

export function SaveFavourite(props: {
  siren: string;
  name: string;
  path: string;
}) {
  useEffect(() => {
    saveFavourite(props);
  }, [props]);
  return null;
}

const LOCALSTORAGE_KEY = 'favourites-siren';
function saveFavourite(visit: { siren: string; name: string; path: string }) {
  try {
    var path = window.location.pathname;
    if (path.indexOf('/entreprise') !== 0) {
      return;
    }

    const favouritesJSON = window.localStorage.getItem(LOCALSTORAGE_KEY);
    const favourites = favouritesJSON ? JSON.parse(favouritesJSON) : [];

    var newFavourites = [visit];
    for (var i = 0; i < favourites.length; i++) {
      if (favourites[i].siren !== visit.siren) {
        newFavourites.push(favourites[i]);
      }
    }

    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(newFavourites.slice(0, 3))
    );
  } catch (e) {
    logInfoInSentry(
      new Exception({
        name: 'SaveFavouriteException',
        cause: e,
      })
    );
  }
}
