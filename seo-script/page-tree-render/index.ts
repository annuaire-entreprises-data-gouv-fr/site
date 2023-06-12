/**
 * Render index page with list of all departments
 */

import {
  getUrlFromDepartement,
  libelleFromCodeNAFWithoutNomenclature,
  libelleFromDepartement,
} from '#utils/helpers/formatting/labels';
import { renderPage } from './html-helpers';

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

const renderDepartementsPage = (departments: any[]) => {
  const title =
    'Les entreprises, associations et services publics de france classés par département';
  const titleBlock = `<h1>${title}</h1>`;
  const description = `L’administration met à disposition des particuliers, entrepreneurs et agents publics la liste officielle des entreprises françaises par département, selon leur activité (code APE/NAF).`;

  const debBlock = departments
    .sort()
    .map((dep) => {
      const labelDep = libelleFromDepartement(dep);
      const urlDep = getUrlFromDepartement(dep);
      return `<a href="/departements/${urlDep}/index.html">${labelDep}</a><br/>`;
    })
    .join('');

  return renderPage(titleBlock + debBlock, title, description);
};

const renderNafsPage = (dep: string, nafs: any[]) => {
  const departementLabel = libelleFromDepartement(dep);

  const navBlock = renderNav([
    ['Tous les départements', '/departements/index.html'],
    [departementLabel, '#title'],
  ]);

  const title = `Les entreprises, associations et services publics de France, classés par activité, dans le département : ${departementLabel} | Annuaire Entreprises`;
  const description = `L’administration met à disposition des particuliers, entrepreneurs et agents publics la liste officielle des entreprises françaises pour le département : ${departementLabel}`;

  const titleBlock = `<h1 id="title">${title}</h1>`;

  // naf links sorted alphabetically
  const nafsBlock = nafs
    .sort((naf1, naf2) =>
      libelleFromCodeNAFWithoutNomenclature(naf1, false) <
      libelleFromCodeNAFWithoutNomenclature(naf2, false)
        ? -1
        : 1
    )
    .map(
      (naf) =>
        `<a href="/departements/${getUrlFromDepartement(
          dep
        )}/${naf}/1.html">${libelleFromCodeNAFWithoutNomenclature(
          naf,
          false
        )} - ${naf}</a><br/>`
    )
    .join('');

  return renderPage(navBlock + titleBlock + nafsBlock, title, description);
};

const renderResultsPage = (
  dep: string,
  naf: string,
  results: any[],
  currentPage: number,
  totalPage: number,
  totalResults: number
) => {
  const depUrl = getUrlFromDepartement(dep);
  const labelNaf = libelleFromCodeNAFWithoutNomenclature(naf, false);
  const departementLabel = libelleFromDepartement(dep);

  const navBlock = renderNav([
    ['Tous les départements', '/departements/deinx.html'],
    [departementLabel, `/departements/${depUrl}/index.html`],
    [labelNaf, '#title'],
  ]);

  const title = `Les entreprises, associations et services publics de France dans le secteur : ${labelNaf} (${naf}) et le département : ${departementLabel}`;
  const titleBlock = `<h1 id="title">${title}</h1>
  <p>${totalResults} personnes morales trouvées :</p>
  `;

  const description = `L’administration met à disposition des particuliers, entrepreneurs et agents publics la liste officielle des entreprises françaises dans le secteur ${naf} et le département ${departementLabel}.`;

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
        paginationBlock += `<a href="/departements/${getUrlFromDepartement(
          dep
        )}/${naf}/${pageNumber}.html">${pageNumber}</a>`;
      }
    }
    paginationBlock = `<br/><div>Autres pages de résultats :</div><div class="pagination">${paginationBlock}</div>`;
  }

  return renderPage(
    navBlock + titleBlock + resultsBlock + paginationBlock,
    title,
    description
  );
};

export { renderDepartementsPage, renderResultsPage, renderNafsPage };
