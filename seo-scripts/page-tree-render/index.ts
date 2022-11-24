/**
 * Render index page with list of all departments
 */

import { renderPage } from './html-helpers';
import {
  libelleFromCodeNAFWithoutNomenclature,
  libelleFromDepartement,
} from '../../utils/labels';
import { escapeTerm } from '../../utils/helpers/formatting';

const renderNav = (links: string[][]) => {
  return `
  <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
    <div class="fr-collapse" id="breadcrumb-1">
      <ol class="fr-breadcrumb__list">
        ${links
          .map(
            (link) =>
              `<li><a class="fr-breadcrumb__link" href="${link[1]}">${link[0]}</a></li>`
          )
          .join('')}
      </ol>
    </div>
  </nav>
  `;
};

export const getUrlFromDep = (dep: string) => {
  // departement label without special char
  const labelDep = escapeTerm(libelleFromDepartement(dep));
  return labelDep.replaceAll(' ', '').toLocaleLowerCase();
};

const renderDepartementsPage = (departments: any[]) => {
  const titleBlock = `<h1>Personnes morales par département</h1>`;
  const debBlock = departments
    .map((dep) => {
      const labelDep = libelleFromDepartement(dep);
      const urlDep = getUrlFromDep(dep);
      return `<a href="/departements/${urlDep}/index.html">${labelDep}</a><br/>`;
    })
    .join('');

  return renderPage(titleBlock + debBlock);
};

const renderNafsPage = (dep: string, nafs: any[]) => {
  const navBlock = renderNav([
    ['Tous les départements', '/departements/index.html'],
    [libelleFromDepartement(dep), '#title'],
  ]);

  const titleBlock = `<h1 id="title">Les personnes morales par activité dans le département ${libelleFromDepartement(
    dep
  )}</h1>`;

  const nafsBlock = nafs
    .map(
      (naf) =>
        `<a href="/departements/${getUrlFromDep(
          dep
        )}/${naf}/1.html">${libelleFromCodeNAFWithoutNomenclature(
          naf
        )}</a><br/>`
    )
    .join('');

  return renderPage(navBlock + titleBlock + nafsBlock);
};

const renderResultsPage = (
  dep: string,
  naf: string,
  results: any[],
  currentPage: number,
  totalPage: number,
  totalResults: number
) => {
  const depUrl = getUrlFromDep(dep);
  const labelNaf = libelleFromCodeNAFWithoutNomenclature(naf);

  const navBlock = renderNav([
    ['Tous les départements', '/departements/deinx.html'],
    [libelleFromDepartement(dep), `/departements/${depUrl}/index.html`],
    [labelNaf, '#title'],
  ]);

  const titleBlock = `<h1 id="title">${labelNaf} dans le département ${libelleFromDepartement(
    dep
  )}</h1>
  <p>${totalResults} personnes morales trouvées :</p>
  `;

  const resultsBlock = results
    .map((result) => {
      const nameElements = result.split('-').slice(0, -1);
      const name = nameElements.join(' ').toUpperCase();
      return `<a href="/entreprise/${result}">${name}</a><br/>`;
    })
    .join('');

  let paginationBlock = '';
  if (totalPage > 1) {
    for (let pageNumber = 1; pageNumber <= totalPage; pageNumber++) {
      if (pageNumber === currentPage) {
        paginationBlock += `<b>${pageNumber}</b>`;
      } else {
        paginationBlock += `<a href="/departements/${getUrlFromDep(
          dep
        )}/${naf}/${pageNumber}.html">${pageNumber}</a>`;
      }
    }
    paginationBlock = `<br/><div>Autres pages de résultats :</div><div class="pagination">${paginationBlock}</div>`;
  }

  return renderPage(navBlock + titleBlock + resultsBlock + paginationBlock);
};

export { renderDepartementsPage, renderResultsPage, renderNafsPage };
