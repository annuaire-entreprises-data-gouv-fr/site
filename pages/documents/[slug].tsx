import React from 'react';
import { GetServerSideProps } from 'next';

import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';
import PageEntreprise from '../../layouts/page-entreprise';
import { FICHE } from '../../components/title-section';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';
import { Section } from '../../components/section';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import { IUniteLegale } from '../../models';

interface IProps extends IPropsWithSession, IConventions {}

const LogInRequired: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <div className="log-in-required">
    <div>
      <span className="fr-fi-lock-fill" aria-hidden="true"></span>
      <p>
        Pour accèder à ces informations, vous devez être dirigeant de{' '}
        {uniteLegale.nomComplet} et vous{' '}
        <a
          href={`/connexion/dirigeant?siren=${uniteLegale.siren}&path=documents`}
        >
          connecter à votre espace dirigeant.
        </a>
      </p>
    </div>
    <style jsx>{`
      .log-in-required {
        background: linear-gradient(
          45deg,
          #dfdff1 12.5%,
          #fff 12.5%,
          #fff 37.5%,
          #dfdff1 37.5%,
          #dfdff1 62.5%,
          #fff 62.5%,
          #fff 87.5%,
          #dfdff1 87.5%
        );
        background-size: 20px 20px;
        background-position: 15px 15px;
        display: inline-block;
        width: 100%;
      }
      .log-in-required > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
        max-width: 700px;
        background-color: #fff;
        color: #000091;
        margin: 30px auto;
        padding: 0px 20px;
        border-radius: 3px;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
      }
    `}</style>
  </div>
);

const Documents: React.FC<IProps> = ({ uniteLegale, session }) => (
  <PageEntreprise
    title={`Conventions collectives - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.DOCUMENTS}
    session={session}
  >
    <Section title="Documents juridiques">
      {!uniteLegale.estEntrepreneurIndividuel && (
        <div>
          <p>
            <b>Statuts constistutifs de l’entité :</b>
          </p>
          <LogInRequired uniteLegale={uniteLegale} />
        </div>
      )}
      <div>
        <p>
          <b>Autres documents juridiques :</b>
        </p>
        <LogInRequired uniteLegale={uniteLegale} />
      </div>
    </Section>
    <Section title="Attestations de vigilance">
      <div>
        <p>Atteste de la conformité</p>
        <LogInRequired uniteLegale={uniteLegale} />
      </div>
    </Section>
    <Section title="Attestations fiscale">
      <div>
        <p>Atteste de la conformité</p>
        <LogInRequired uniteLegale={uniteLegale} />
      </div>
    </Section>
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;

    const uniteLegale = await getUniteLegaleFromSlug(siren);

    return {
      props: {
        uniteLegale,
      },
    };
  })
);

export default Documents;
