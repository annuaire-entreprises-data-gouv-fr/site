import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import SearchFilterParams from '../../models/search-filter-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import ResultsBody from '../../components/search-results/results-body';
import { IEtatCivil } from '../../models/immatriculation/rncs';

interface IProps extends IPropsWithMetadata {
  results: ISearchResults;
  personne: IEtatCivil;
}

const SearchDirigeantPage: React.FC<IProps> = ({
  results,
  metadata,
  personne,
}) => (
  <Page
    small={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    isBrowserOutdated={metadata.isBrowserOutdated}
    useAdvancedSearch={false}
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Recherche des entitées associées à un individu" />
    <h2>
      Ensemble des entitées associées à {personne.prenom} {personne.nom} :
    </h2>
    <ResultsBody results={results} />
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);
    const searchFilterParams = new SearchFilterParams(context.query);
    const results = await search(searchTerm, page, searchFilterParams);

    return {
      props: {
        results,
        personne: searchFilterParams.getPersonne(),
      },
    };
  }
);

export default SearchDirigeantPage;
