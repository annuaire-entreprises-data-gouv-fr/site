import { Info } from '#components-ui/alerts';
import FAQLink from '#components-ui/faq-link';
import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import PageCounter from '#components/search-results/results-pagination';
import StructuredDataSearchAction from '#components/structured-data/search';
import { FullTable } from '#components/table/full';
import { searchPersonCompanies } from '#models/search';
import {
  convertDateToAge,
  formatDatePartial,
  formatFirstNames,
  formatIntFr,
  parseIntWithDefaultValue,
} from '#utils/helpers';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import { isPersonneMorale } from 'app/(header-default)/dirigeants/[slug]/_component/sections/is-personne-morale';
import { Metadata } from 'next';
import { use } from 'react';

export default function extractParamsPersonne(props: AppRouterProps) {
  const searchParams = use(props.searchParams);

  const pageParam = (searchParams.page || '') as string;
  const sirenFrom = (searchParams.sirenFrom || '') as string;
  const partialDate = (searchParams.partialDate || '') as string;
  const fn = (searchParams.fn || '') as string;
  const nom = (searchParams.n || '') as string;

  return {
    pageParam,
    partialDate,
    sirenFrom,
    nom,
    fn,
    urlComplements: `fn=${fn}&n=${nom}&partialDate=${partialDate}&sirenFrom=${sirenFrom}`,
  };
}

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { urlComplements } = extractParamsPersonne(props);
  return {
    title: 'Liste des structures associées à un individu',
    robots: 'follow, noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/personne?${urlComplements}`,
    },
  };
};

const PersonnePage = async (props: AppRouterProps) => {
  const { urlComplements, fn, nom, pageParam, sirenFrom, partialDate } =
    extractParamsPersonne(props);

  const { prenom, prenoms } = formatFirstNames(fn, ', ');

  const page = parseIntWithDefaultValue(pageParam, 1);

  const results = await searchPersonCompanies(
    nom,
    prenom,
    prenoms,
    partialDate,
    sirenFrom,
    page
  );

  const age = convertDateToAge(partialDate);
  const structureCountLabel =
    results.resultCount === 0 ? 'Aucune' : results.resultCount;
  const plural = results.resultCount > 1;

  return (
    <div className="content-container">
      <StructuredDataSearchAction />
      {sirenFrom && (
        <a href={`/dirigeants/${sirenFrom}`}>
          ← Retourner à la page précédente
        </a>
      )}
      <h1>
        {structureCountLabel} structure{plural && 's'} associée{plural && 's'} à{' '}
        {prenom} {nom}
        {age ? ` (${age} ans)` : ''}
      </h1>
      <p>
        <FAQLink tooltipLabel="Etat civil">
          Ceci est un état civil partiel. Il est composé du mois et de l’année
          de naissance ainsi que des prénoms et du nom. Cet état civil peut ne
          pas contenir les prénoms secondaires.
        </FAQLink>{' '}
        :{' '}
        <strong>
          {prenoms} {nom}
        </strong>
        , né(e) en {formatDatePartial(partialDate)}
      </p>
      <Info>
        Le jour de naissance n’étant pas une donnée publique et les prénoms
        secondaires n’étant pas toujours renseignés, cette page peut comporter
        de rares cas <strong>d’homonymie</strong>.
        <br />
        Si <strong>vous ne retrouvez pas une entreprise</strong> qui devrait se
        trouver dans la liste, vous pouvez effectuer une recherche{' '}
        <a href={`/rechercher?fn=${prenoms}&n=${nom}`}>sans filtre d’âge</a> ou{' '}
        <a href={`/rechercher?fn=${prenom}&n=${nom}`}>
          sans prénom secondaire et sans filtre d’age
        </a>
        .
      </Info>
      <br />

      {results.results.length > 0 ? (
        <FullTable
          head={['Siren', 'Détails', 'Dirigeant(s)']}
          body={results.results.map((result) => [
            <a href={`/entreprise/${result.chemin}`}>
              {formatIntFr(result.siren)}
            </a>,
            <>
              {result.nomComplet}
              <br />
              {result.siege.adresse}
            </>,
            <div>
              {result.dirigeants.map((dirigeantOrElu) => (
                <div>
                  {isPersonneMorale(dirigeantOrElu) ? (
                    <>
                      {dirigeantOrElu.siren ? (
                        <a
                          href={`/dirigeants/${dirigeantOrElu.siren}`}
                          aria-label={`Voir les dirigeants de cette entreprise (siren ${dirigeantOrElu.siren})`}
                        >
                          {dirigeantOrElu.denomination}
                        </a>
                      ) : (
                        dirigeantOrElu.denomination
                      )}
                    </>
                  ) : (
                    <>
                      {dirigeantOrElu.dateNaissancePartial ? (
                        <SeePersonPageLink
                          person={dirigeantOrElu}
                          label={`${dirigeantOrElu.prenoms} ${dirigeantOrElu.nom}`}
                        />
                      ) : (
                        `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
                      )}
                      {!isPersonneMorale(dirigeantOrElu) &&
                      dirigeantOrElu.prenoms !== prenoms &&
                      dirigeantOrElu.prenom === prenom &&
                      dirigeantOrElu.nom.toLowerCase() === nom.toLowerCase() ? (
                        <>
                          {' '}
                          (
                          <FAQLink tooltipLabel={<i>possible homonymie</i>}>
                            Il est probable que {dirigeantOrElu.prenoms}{' '}
                            {dirigeantOrElu.nom} et {prenoms} {nom} soient la
                            même personne mais cela peut aussi être des
                            homonymes.
                          </FAQLink>
                          )
                          <br />
                        </>
                      ) : null}{' '}
                    </>
                  )}
                </div>
              ))}
            </div>,
          ])}
        />
      ) : (
        <i>Aucune structure n’a été retrouvée pour cette personne.</i>
      )}

      {results.pageCount > 0 && (
        <PageCounter
          totalPages={results.pageCount}
          searchTerm=""
          currentPage={results.currentPage}
          urlComplement={`&${urlComplements}`}
        />
      )}
      <br />
    </div>
  );
};
