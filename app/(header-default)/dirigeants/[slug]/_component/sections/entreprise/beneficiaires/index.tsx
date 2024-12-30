'use client';

import { Section } from '#components/section';
import UseCaseWrapper from '#components/use-case-wrapper';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import ProtectedBeneficiairesSection from './agent-section';
import { WarningRBE } from './warning-rbe';

const BeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, ApplicationRights.beneficiaires)) {
    return (
      <Section title="Bénéficiaire(s) effectif(s)" id="beneficiaires">
        <WarningRBE />
      </Section>
    );

    // return (
    //   <AgentWall
    //     title="Bénéficiaire(s) effectif(s)"
    //     id="beneficiaires"
    //     sectionIntro={
    //       <>
    //         <WarningRBE />
    //         <br />
    //       </>
    //     }
    //     sources={[EAdministration.INPI]}
    //     conditionExplanation={
    //       <>
    //         Disponible pour les <strong>administrations légitimes</strong>{' '}
    //         (attribution d’
    //         <strong>aides publiques</strong>, <strong>marchés publics</strong>{' '}
    //         et <strong>lutte contre la fraude</strong>).
    //       </>
    //     }
    //   />
    // );
  }

  const introContent = (
    <>
      <p>
        Depuis le 31 juillet 2024, les{' '}
        <a href="/faq/registre-des-beneficiaires-effectifs">
          bénéficiaires effectifs ne sont plus librement accessibles
        </a>
        .
      </p>
      <p>
        Les agents publics peuvent y accéder uniquement dans les cas d’usages
        justifiant d’un intérêt légitime. En déclarant le cadre juridique dans
        lequel vous accédez à ces données, vous vous engagez{' '}
        <a href="/cgu">à respecter nos conditions générales d’utilisation</a>.
      </p>
      <p>
        Toute demande d’accès aux données est tracée et envoyée à la commission
        européeene.
      </p>
    </>
  );

  return (
    <UseCaseWrapper
      title="Bénéficiaire(s) effectif(s)"
      id="beneficiaires"
      sources={[EAdministration.INPI]}
      introContent={introContent}
    >
      {(useCase) => (
        <ProtectedBeneficiairesSection
          uniteLegale={uniteLegale}
          session={session}
          useCase={useCase}
        />
      )}
    </UseCaseWrapper>
  );
};

export default BeneficiairesSection;
