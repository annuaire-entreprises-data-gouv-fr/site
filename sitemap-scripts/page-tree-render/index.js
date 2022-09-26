/**
 * Render index page with list of all departments
 */

const { WEBSITE } = require('../constants');
const { renderPage } = require('./html-helpers');

const renderDepartementsPage = (departments) => {
  return renderPage(
    departments
      .map(
        (dep) =>
          `<div><a href="/departements/${dep}/index.html">${dep}</a></div>`
      )
      .join('')
  );
};

const renderNafsPage = (dep, nafs) => {
  return renderPage(
    nafs
      .map(
        (naf) =>
          `<div><a href="/departements/${dep}/${naf}/1.html">${naf}</a></div>`
      )
      .join('')
  );
};

const renderResultsPage = (dep, naf, results, currentPage, totalPage) => {
  const resultsBlock = results
    .map((result) => `<div><a href="/entreprise/${result}">${result}</a></div>`)
    .join('');

  let pagination = '';
  for (let pageNumber = 1; pageNumber <= totalPage; pageNumber++) {
    if (pageNumber === currentPage) {
      pagination += `<b>${pageNumber}</b>`;
    } else {
      pagination += `<a href="/departements/${dep}/${naf}/${pageNumber}.html">${pageNumber}</a>`;
    }
  }

  return renderPage(resultsBlock + `<div>${pagination}</div>`);
};

module.exports = { renderDepartementsPage, renderResultsPage, renderNafsPage };
