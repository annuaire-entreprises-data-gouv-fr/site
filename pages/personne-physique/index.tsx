import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import StructuredDataSearchAction from '../../components/structured-data/search';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import { IEtatCivil } from '../../models/immatriculation/rncs';
import ResultsList from '../../components/search-results/results-list';
import PageCounter from '../../components/results-page-counter';
import Info from '../../components-ui/alerts/info';

interface IProps extends IPropsWithMetadata {
  results: ISearchResults;
  personne: IEtatCivil;
  searchParams: IParams;
  sirenFrom: string;
}

const SearchDirigeantPage: React.FC<IProps> = ({
  results,
  metadata,
  searchParams,
  sirenFrom,
}) => (
  <Page
    small={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    isBrowserOutdated={metadata.isBrowserOutdated}
    useAdvancedSearch={false}
  >
    <div className="content-container">
      <StructuredDataSearchAction />
      {sirenFrom && (
        <a href={`/dirigeants/${sirenFrom}`}>
          ← Retourner à la page précédente
        </a>
      )}
      <h1>
        Ensemble des entitées associées à {searchParams.fn} {searchParams.n}
        {searchParams.ageMax || searchParams.ageMin
          ? ` (${searchParams.ageMax || searchParams.ageMin} ans)`
          : ''}
      </h1>
      <span>
        {results.currentPage > 1 && `Page ${results.currentPage} de `}
        {results.resultCount} résultats trouvés.
      </span>
      <ResultsList
        results={results.results}
        withFeedback={false}
        searchTerm=""
      />
      {results.pageCount > 0 && (
        <PageCounter
          totalPages={results.pageCount}
          searchTerm=""
          currentPage={results.currentPage}
          searchFilterParams={searchParams}
        />
      )}
      <Info>
        <div>Vous n’avez pas trouvé l’entreprise que vous recherchiez ?</div>
        <br />
        <a href={`/rechercher?fn=${searchParams.fn}&n=${searchParams.n}`}>
          → élargir la recherche à toutes les entreprises dirigées par une
          personne appelée « {searchParams.fn} {searchParams.n} »
        </a>
      </Info>
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const sirenFrom = (context.query.sirenFrom || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);
    const searchFilterParams = new SearchFilterParams(context.query);
    const results = await search(searchTerm, page, searchFilterParams);

    const searchParams = searchFilterParams.toJSON();

    return {
      props: {
        results,
        searchParams,
        sirenFrom,
      },
    };
  }
);

export default SearchDirigeantPage;
