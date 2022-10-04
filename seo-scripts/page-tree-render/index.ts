/**
 * Render index page with list of all departments
 */

import { renderPage } from './html-helpers';
import {
  libelleFromCodeNAFWithoutNomenclature,
  libelleFromDepartement,
} from '../../utils/labels';
import { escapeTerm } from '../../utils/helpers/formatting';

export const getUrlFromDep = (dep: string) => {
  const labelDep = libelleFromDepartement(dep);
  return escapeTerm(labelDep.replaceAll(' ', '').toLocaleLowerCase());
};

const renderBreadcrumb = (links: string[][]) => {
  return `
    <nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
      <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">Voir le fil d’Ariane</button>
      <div class="fr-collapse" id="breadcrumb-1">
          <ol class="fr-breadcrumb__list">
            ${links.map(
              (link) =>
                `<li><a class="fr-breadcrumb__link" href="${link[1]}">${link[0]}</a></li>`
            )}
          </ol>
      </div>
  </nav>
`;
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
  const navBlock = renderBreadcrumb([
    ['Tous les départements', '/departements/deinx.html'],
    [libelleFromDepartement(dep), ''],
  ]);

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
  const labelNaf = libelleFromCodeNAFWithoutNomenclature(naf);
  const navBlock = renderBreadcrumb([
    ['Tous les départements', '/departements/deinx.html'],
    [
      libelleFromDepartement(dep),
      `/departements/${getUrlFromDep(dep)}/index.html`,
    ],
    [labelNaf, ''],
  ]);

  const titleBlock = `<h1>${labelNaf} dans le département ${libelleFromDepartement(
    dep
  )}</h1>
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

  return renderPage(navBlock + titleBlock + resultsBlock + paginationBlock);
};

export { renderDepartementsPage, renderResultsPage, renderNafsPage };
