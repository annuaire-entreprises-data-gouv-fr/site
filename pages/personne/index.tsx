import { GetServerSideProps } from 'next';
import { Info } from '#components-ui/alerts';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import Meta from '#components/meta/meta-client';
import PageCounter from '#components/search-results/results-pagination';
import StructuredDataSearchAction from '#components/structured-data/search';
import { FullTable } from '#components/table/full';
import { IEtatCivil } from '#models/immatriculation';
import { ISearchResults, searchPersonCompanies } from '#models/search';
import {
  convertDateToAge,
  formatDatePartial,
  formatFirstNames,
  formatIntFr,
  parseIntWithDefaultValue,
} from '#utils/helpers';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-helper/page/post-server-side-props';
import { isPersonneMorale } from 'app/(header-default)/dirigeants/[slug]/_component/sections/is-personne-morale';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  results: ISearchResults;
  personne: IEtatCivil;
  sirenFrom: string;
  partialDate: string;
  prenoms: string;
  prenom: string;
  nom: string;
  age: number;
}

const SearchDirigeantPage: NextPageWithLayout<IProps> = ({
  results,
  sirenFrom,
  partialDate,
  prenoms,
  prenom,
  nom,
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
        {results.resultCount} structures associées à {prenom} {nom}
        {age ? ` (${age} ans)` : ''}.
      </h1>
      <p>
        Etat civil :{' '}
        <strong>
          {prenoms} {nom}
        </strong>
        , né(e) en {formatDatePartial(partialDate)}
      </p>
      <Info>
        Le jour de naissance n’étant pas une donnée publique et les prénoms
        secondaires n’étant pas toujours renseignés. Cette page peut comporter
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
      <FullTable
        head={['Siren', 'Détails', '', 'Dirigeant(s) ou élu(s)']}
        body={results.results.map((result) => [
          <a href={result.chemin}>{formatIntFr(result.siren)}</a>,
          <>
            {result.nomComplet}
            <br />
            {result.siege.adresse}
          </>,
          <>
            {result.dirigeants.find(
              (d) =>
                !isPersonneMorale(d) &&
                d.prenoms !== prenoms &&
                d.prenom === prenom &&
                d.nom.toLowerCase() === nom.toLowerCase()
            ) ? (
              <InformationTooltip
                label={`Il est probable que ${prenoms} ${nom} et ${prenom} ${nom} soient la même personne mais ce n’est pas possible d’en être certain.`}
                tabIndex={undefined}
              >
                <Icon slug="information" color="orange" />
              </InformationTooltip>
            ) : null}
          </>,
          <div>
            {result.dirigeants.map((dirigeantOrElu) => (
              <div>
                {isPersonneMorale(dirigeantOrElu) ? (
                  <>
                    {dirigeantOrElu.siren ? (
                      <a href={`/dirigeants/${dirigeantOrElu.siren}`} aria-label={`Voir les dirigeants de cette entreprise (siren ${dirigeantOrElu.siren})`}>
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
                  </>
                )}
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
          urlComplement={`&fn=${prenoms}&n=${nom}&partialDate=${partialDate}&sirenFrom=${sirenFrom}`}
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

    const { prenom, prenoms } = formatFirstNames(fn, ', ');

    const page = parseIntWithDefaultValue(pageParam, 1);

    const results = await searchPersonCompanies(
      n,
      prenom,
      prenoms,
      partialDate,
      sirenFrom,
      page
    );

    return {
      props: {
        prenom,
        prenoms,
        nom: n,
        results,
        sirenFrom,
        partialDate: partialDate,
        age: convertDateToAge(partialDate),
      },
    };
  }
);

export default SearchDirigeantPage;
