import { GetServerSideProps } from 'next';
import { FondationBadge } from '#components-ui/badge/frequent';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import IsActiveTag from '#components-ui/is-active-tag';
import Meta from '#components/meta';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import { IFondation, getFondationFromSlug } from '#models/fondations';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import { formatDate, formatIntFr } from '#utils/helpers';
import { libelleFromDepartement } from '#utils/helpers/formatting/labels';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  fondation: IFondation;
}

const FondationPage: NextPageWithLayout<IProps> = ({ fondation }) => (
  <>
    <Meta
      title={fondation.nomComplet}
      noIndex={true}
      canonical={`https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.idRnf}`}
    />

    <h1>{fondation.nomComplet}</h1>
    <div className="fondation-sub-title">
      <FondationBadge />
      <span className="siren">&nbsp;‣&nbsp;{formatIntFr(fondation.idRnf)}</span>
      <span>
        <IsActiveTag
          etatAdministratif={fondation.etatAdministratif}
          statutDiffusion={ISTATUTDIFFUSION.DIFFUSIBLE}
        />
      </span>
    </div>

    <div className="content-container">
      <DataSection
        title="Répertoire National des fondations"
        sources={[EAdministration.MI]}
        data={fondation}
      >
        {(fondation) => (
          <>
            <TwoColumnTable
              body={[
                ['N°RNF', fondation.idRnf],
                ['Nom', fondation.nomComplet],
                [
                  'Département',
                  `${libelleFromDepartement(fondation.departement)} (${
                    fondation.departement
                  })`,
                ],
                ['Adresse', fondation.adresse],
                ['Date de création', formatDate(fondation.dateCreation)],
                ...(fondation.dateFermeture
                  ? [['Date de fermeture', formatDate(fondation.dateCreation)]]
                  : []),
                [
                  'Téléphone',
                  fondation.telephone ? (
                    <a href={`tel:${fondation.telephone}`}>
                      {fondation.telephone}
                    </a>
                  ) : (
                    ''
                  ),
                ],
                [
                  'Email',
                  fondation.email ? (
                    <a href={`mailto:${fondation.email}`}>{fondation.email}</a>
                  ) : (
                    ''
                  ),
                ],
              ]}
            />
          </>
        )}
      </DataSection>
    </div>
    <HorizontalSeparator />
    <style jsx>{`
      .fondation-sub-title {
        display: flex;
        align-items: center;
      }
    `}</style>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context, true);

    const fondation = await getFondationFromSlug(slug);

    return {
      props: {
        fondation,
      },
    };
  }
);

export default FondationPage;
