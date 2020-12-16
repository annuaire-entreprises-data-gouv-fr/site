import http from 'k6/http';
import { sleep, check } from 'k6';

const urls = open('../sitemap/sitemap-name.csv');
const URL_TO_TEST = 20;

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//randomly select a pool of url to test with
const selectedUrls = shuffle(urls.split('\n')).slice(
  0,
  Math.max(URL_TO_TEST * 100, 50000)
);

export let options = {
  vus: 5,
  iterations: 50,
};

export default function () {
  const urlsToTest = shuffle(selectedUrls).slice(0, URL_TO_TEST);

  urlsToTest.forEach((line, idx) => {
    const test = `http://annuaire-entreprise-gouv-staging.app.etalab.studio/justificatif/${line}`;
    const res = http.get(test);
    check(res, {
      'response code was 200': (res) => res.status == 200,
      'request was fast': (res) => res.timings.duration <= 500,
    });
    if (res.status !== 200) {
      console.log(test);
    }
    // sleep(TIME_WINDOW_SECOND / URL_TO_TEST);
  });

  // urlsToTest.forEach((line, idx) => {
  //   const test = `http://annuaire-entreprise-gouv-staging.app.etalab.studio/rechercher?terme=${line
  //     .slice(0, line.length - 9)
  //     .split('-')
  //     .join('+')}`;
  //   const res = http.get(test);
  //   check(res, {
  //     'response code was 200': (res) => res.status == 200,
  //     'request was fast': (res) => res.timings.duration <= 500,
  //   });
  //   if (res.status !== 200) {
  //     console.log(test);
  //   }
  //   // sleep(TIME_WINDOW_SECOND / URL_TO_TEST);
  // });
}
