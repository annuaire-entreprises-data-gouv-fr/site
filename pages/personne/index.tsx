import { Info } from '#components-ui/alerts';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import Meta from '#components/meta/meta-client';
import PageCounter from '#components/search-results/results-pagination';
import StructuredDataSearchAction from '#components/structured-data/search';
import { FullTable } from '#components/table/full';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { IEtatCivil } from '#models/immatriculation';
import { ISearchResults, searchPersonCompanies } from '#models/search';
import {
  convertDateToAge,
  formatDatePartial,
  formatIntFr,
  parseIntWithDefaultValue,
} from '#utils/helpers';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-helper/page/post-server-side-props';
import { isPersonneMorale } from 'app/(header-default)/dirigeants/[slug]/_component/sections/is-personne-morale';
import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  results: ISearchResults;
  personne: IEtatCivil;
  sirenFrom: string;
  partialDate: string;
  fn: string;
  firstName: string;
  n: string;
  age: number;
}

const SearchDirigeantPage: NextPageWithLayout<IProps> = ({
  results,
  sirenFrom,
  partialDate,
  fn,
  firstName,
  n,
  age,
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
        Liste des structures associées à {fn} {n}
        {age ? ` (${age} ans)` : ''}
      </h1>
      <Info>
        Cette page liste toutes les structures associées à{' '}
        <strong>
          {fn} {n}
        </strong>
        , né(e) en {formatDatePartial(partialDate)}.
        <br />
        Le jour de naissance n’étant pas une donnée publique, cette page peut
        comporter de très rares cas <strong>d’homonymie</strong>.
        <br />
        <br />
        Enfin, si <strong>vous ne retrouvez pas une entreprise</strong> qui
        devrait se trouver dans la liste , vous pouvez{' '}
        <a href={`/rechercher?fn=${fn}&n=${n}`}>
          élargir la recherche à toutes les structures liées à une personne
          appelée «&nbsp;
          {fn} {n}
          &nbsp;», sans filtre d’âge.
        </a>
      </Info>
      <HorizontalSeparator />
      <div>
        {results.currentPage > 1 && `Page ${results.currentPage} de `}
        {results.resultCount} résultat(s) trouvé(s).
      </div>
      <br />
      <FullTable
        head={[
          'Siren',
          'Type',
          'Dénomination',
          'Adresse',
          'Dirigeant(s) ou élu(s)',
        ]}
        body={results.results.map((result) => [
          <a href={result.chemin}>{formatIntFr(result.siren)}</a>,
          <UniteLegaleBadge uniteLegale={result} />,
          <>{result.nomComplet}</>,
          <>{result.siege.adresse}</>,
          <div>
            {result.dirigeants.map((dirigeantOrElu) => (
              <div>
                {isPersonneMorale(dirigeantOrElu)
                  ? `${dirigeantOrElu.denomination}`
                  : `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`}
              </div>
            ))}
          </div>,
        ])}
      />
      {results.pageCount > 0 && (
        <PageCounter
          totalPages={results.pageCount}
          searchTerm=""
          currentPage={results.currentPage}
          urlComplement={`&fn=${fn}&n=${n}&partialDate=${partialDate}&sirenFrom=${sirenFrom}`}
        />
      )}
      <br />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const pageParam = (context.query.page || '') as string;
    const sirenFrom = (context.query.sirenFrom || '') as string;
    const partialDate = (context.query.partialDate || '') as string;
    const fn = (context.query.fn || '') as string;
    const n = (context.query.n || '') as string;

    const firstName = fn.split(', ')[0];

    const page = parseIntWithDefaultValue(pageParam, 1);

    const results = await searchPersonCompanies(
      n,
      firstName,
      partialDate,
      sirenFrom,
      page
    );

    return {
      props: {
        fn,
        firstName,
        n,
        results,
        sirenFrom,
        partialDate: partialDate,
        age: convertDateToAge(partialDate),
      },
    };
  }
);

export default SearchDirigeantPage;
