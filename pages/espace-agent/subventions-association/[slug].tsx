import { GetServerSideProps } from 'next';
import React from 'react';
import ProtectedData from '#components-ui/alerts/protected-data';
import ButtonLink from '#components-ui/button';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import AssociationSection from '#components/association-section';
import Meta from '#components/meta';
import { ProtectedSection } from '#components/section/protected-section';
import { FullTable } from '#components/table/full';
import Title, { FICHE } from '#components/title-section';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import {
  getAssoSubventionsWithUniteLegaleFromSlug,
  ISubventionsAssociation,
} from '#models/espace-agent/subventions-association';
import { isAssociation } from '#models/index';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isLoggedIn } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, ISubventionsAssociation {}

const SubventionsAssociationPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  subventionsDocuments,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Espace Agent Public - Subventions Association | Annuaire des Entreprises`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.AGENT_SUBVENTIONS}
          uniteLegale={uniteLegale}
          session={session}
        />
        <ProtectedData>
          Cette page contient des informations sensibles réservées aux{' '}
          <b>agents publics</b>{' '}
          <a href="">(consultez nos conditions d’utilisation)</a>
        </ProtectedData>
        <br />
        {isAssociation(uniteLegale) ? (
          <>
            <AssociationSection uniteLegale={uniteLegale} />
            {isAPINotResponding(subventionsDocuments) ? (
              <p>Erreur</p>
            ) : (
              <>
                <ProtectedSection
                  title="Statuts"
                  sources={[EAdministration.MI]}
                >
                  <p>
                    Les statuts les plus récents pour cette association datent
                    de {subventionsDocuments.statuts.annee} :
                  </p>
                  <div className="layout-center">
                    <ButtonLink
                      to={subventionsDocuments.statuts.url}
                      target="_blank"
                    >
                      Télécharger les statuts{' '}
                      {subventionsDocuments.statuts.annee}
                    </ButtonLink>
                  </div>
                </ProtectedSection>
                <HorizontalSeparator />
                <ProtectedSection
                  title="Documents"
                  sources={[EAdministration.MI]}
                >
                  <FullTable
                    head={['Siret', 'Documents de l’établissement']}
                    body={subventionsDocuments.dac.map(
                      ({
                        siret,
                        comptes,
                        rapportFinancier,
                        rapportActivite,
                        exerciceComptable,
                      }) => [
                        siret,
                        <>
                          <b>Comptes :</b>
                          {comptes.length > 0 ? (
                            JSON.stringify(comptes)
                          ) : (
                            <i>
                              Aucun compte n’a été déclaré pour cette
                              association.
                            </i>
                          )}
                          <br />
                          <b>Rapport financier :</b>
                          {rapportFinancier.length > 0 ? (
                            <FullTable head={[]} body={[]} />
                          ) : (
                            <i>
                              Aucun rapport financier n’a été déclaré pour cette
                              association.
                            </i>
                          )}
                          <br />
                          <b>Rapport d’activité :</b>
                          {rapportActivite.length > 0 ? (
                            <FullTable head={[]} body={[]} />
                          ) : (
                            <i>
                              Aucun rapport d’activité n’a été déclaré pour
                              cette association.
                            </i>
                          )}
                          <br />
                          <b>Exercice comptable :</b>
                          {exerciceComptable.length > 0 ? (
                            <FullTable head={[]} body={[]} />
                          ) : (
                            <i>
                              Aucun exercice comptable n’a été déclaré pour
                              cette association.
                            </i>
                          )}
                        </>,
                      ]
                    )}
                  />
                  <br />
                  <br />
                </ProtectedSection>
              </>
            )}
          </>
        ) : (
          <p>Cette structure n’est pas une association</p>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    if (!isLoggedIn(context.req?.session)) {
      return {
        redirect: {
          destination: `/connexion/agent-public`,
          permanent: false,
        },
      };
    }

    const { slug } = extractParamsFromContext(context);
    const { uniteLegale, subventionsDocuments } =
      await getAssoSubventionsWithUniteLegaleFromSlug(slug);

    return {
      props: {
        uniteLegale,
        subventionsDocuments,
        metadata: { useReact: true },
      },
    };
  }
);

export default SubventionsAssociationPage;
