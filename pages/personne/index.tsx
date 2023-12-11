import { GetServerSideProps } from 'next';
import Info from '#components-ui/alerts/info';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import Meta from '#components/meta';
import ResultsList from '#components/search-results/results-list';
import PageCounter from '#components/search-results/results-pagination';
import StructuredDataSearchAction from '#components/structured-data/search';
import { Exception } from '#models/exceptions';
import { IEtatCivil } from '#models/immatriculation';
import { ISearchResults, searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, { IParams } from '#models/search-filter-params';
import {
  formatDatePartial,
  formatMonthIntervalFromPartialDate,
  parseIntWithDefaultValue,
} from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  results: ISearchResults;
  personne: IEtatCivil;
  searchParams: IParams;
  sirenFrom: string;
  labelDatePartial: string;
}

const SearchDirigeantPage: NextPageWithLayout<IProps> = ({
  results,
  searchParams,
  sirenFrom,
  labelDatePartial,
}) => (
  <>
    <Meta
      title="Liste des structures associées à un individu"
      canonical="https://annuaire-entreprises.data.gouv.fr/personne"
      noIndex={true}
    />
    <div className="content-container">
      <StructuredDataSearchAction />
      {sirenFrom && (
        <a href={`/dirigeants/${sirenFrom}`}>
          ← Retourner à la page précédente
        </a>
      )}
      <h1>
        Liste des structures associées à {searchParams.fn} {searchParams.n}
        {searchParams.ageMax || searchParams.ageMin
          ? ` (${searchParams.ageMax || searchParams.ageMin} ans)`
          : ''}
      </h1>
      <Info>
        Cette page liste toutes les structures associées à{' '}
        <b>
          {searchParams.fn} {searchParams.n}
        </b>
        , né(e) en {labelDatePartial}.
        <br />
        Le jour de naissance n’étant pas une donnée publique, cette page peut
        comporter de très rares cas <b>d’homonymie</b>.
        <br />
        <br />
        Enfin, si <b>vous ne retrouvez pas une entreprise</b> qui devrait se
        trouver dans la liste , vous pouvez{' '}
        <a href={`/rechercher?fn=${searchParams.fn}&n=${searchParams.n}`}>
          élargir la recherche à toutes les structures liées à une personne
          appelée «&nbsp;
          {searchParams.fn} {searchParams.n}
          &nbsp;», sans filtre d’âge.
        </a>
      </Info>
      <HorizontalSeparator />
      <span>
        {results.currentPage > 1 && `Page ${results.currentPage} de `}
        {results.resultCount} résultats trouvés.
      </span>
      <ResultsList results={results.results} />
      {results.pageCount > 0 && (
        <PageCounter
          totalPages={results.pageCount}
          searchTerm=""
          currentPage={results.currentPage}
          searchFilterParams={searchParams}
        />
      )}
      <br />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const sirenFrom = (context.query.sirenFrom || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);

    const monthInterval = formatMonthIntervalFromPartialDate(
      (context.query.partialDate as string) || ''
    ) ?? ['', ''];
    const [beginingOfMonth, endOfMonth] =
      typeof monthInterval === 'string' ? ['', ''] : monthInterval;

    const dmin = (context.query.dmin as string) || beginingOfMonth;
    const dmax = (context.query.dmax as string) || endOfMonth;

    const searchFilterParams = new SearchFilterParams({
      ...context.query,
      dmin,
      dmax,
    });

    const results = await searchWithoutProtectedSiren(
      searchTerm,
      page,
      searchFilterParams
    );

    const searchParams = searchFilterParams.toJSON();

    if (!dmin || !dmax) {
      logWarningInSentry(
        new Exception({
          name: 'SearchDirigeantBadParams',
          message: 'No date bounds in page personne',
          context: {
            siren: sirenFrom,
          },
        })
      );
    }

    return {
      props: {
        results,
        searchParams,
        sirenFrom,
        labelDatePartial: formatDatePartial(dmin || dmax),
      },
    };
  }
);

export default SearchDirigeantPage;
