/**
 * Render index page with list of all departments
 */

import { renderPage } from './html-helpers';
import {
  libelleFromCodeNAFWithoutNomenclature,
  libelleFromDepartement,
} from '../../utils/labels';

export const getUrlFromDep = (dep: string) => {
  const labelDep = libelleFromDepartement(dep);
  return encodeURI(labelDep.replaceAll(' ', '').toLocaleLowerCase());
};

const renderDepartementsPage = (departments: any[]) => {
  const titleBlock = `<h1>Personnes morales par département</h1>`;
  const debBlock = departments
    .map((dep) => {
      const labelDep = libelleFromDepartement(dep);
      const urlDep = getUrlFromDep(dep);
      return `<div><a href="/departements/${urlDep}/index.html">${labelDep}</a></div>`;
    })
    .join('');

  return renderPage(titleBlock + debBlock);
};

const renderNafsPage = (dep: string, nafs: any[]) => {
  const navBlock = `<a href="/departements/index.html">← Toutes les départements</a><br/>`;
  const titleBlock = `<h1>Les personnes morales par activité dans le département ${libelleFromDepartement(
    dep
  )}</h1>`;
  const nafsBlock = nafs
    .map(
      (naf) =>
        `<div><a href="/departements/${getUrlFromDep(
          dep
        )}/${naf}/1.html">${libelleFromCodeNAFWithoutNomenclature(
          naf
        )}</a></div>`
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
  const returnBlock = `<a href="/departements/${dep}/index.html">← Toutes les activités de ce département</a><br/>`;
  const titleBlock = `<h1>${libelleFromCodeNAFWithoutNomenclature(
    naf
  )} dans le département ${libelleFromDepartement(dep)}</h1>
  <p>${totalResults} personnes morales trouvées :</p>
  `;
  const resultsBlock = results
    .map((result) => {
      const nameElements = result.split('-').slice(0, -1);
      const name = nameElements.join(' ').toUpperCase();
      return `<div><a href="/entreprise/${result}">${name}</a></div>`;
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

  return renderPage(returnBlock + titleBlock + resultsBlock + paginationBlock);
};

export { renderDepartementsPage, renderResultsPage, renderNafsPage };
