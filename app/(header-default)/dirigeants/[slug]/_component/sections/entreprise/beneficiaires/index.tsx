'use client';

import { Warning } from '#components-ui/alerts';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { useState } from 'react';
import ProtectedBeneficiairesSection from './agent-section';
import { AskUseCase } from './ask-use-case';

const WarningRBE = () => (
  <Warning>
    À compter du 31 juillet 2024, le{' '}
    <a href="/faq/registre-des-beneficiaires-effectifs">
      registre des bénéficiaires effectifs n’est plus accessible sur le site
    </a>
    , en application de la{' '}
    <a
      href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049761732"
      target="_blank"
      rel="noopener noreferrer"
    >
      directive européenne 2024/1640 du 31 mai 2024
    </a>
    . Désormais, les{' '}
    <a
      href="https://www.inpi.fr/faq/qui-peut-acceder-aux-donnees-des-beneficiaires-effectifs"
      target="_blank"
      rel="noopener noreferrer"
    >
      personnes en mesure de justifier d’un intérêt légitime
    </a>{' '}
    peuvent{' '}
    <a
      href="https://data.inpi.fr/content/editorial/acces_BE"
      target="_blank"
      rel="noopener noreferrer"
    >
      effectuer une demande d’accès
    </a>{' '}
    au registre auprès de l’
    <INPI />.
  </Warning>
);

const BeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const [useCase, setUseCase] = useState<UseCase>();

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

  if ([UseCase.aides, UseCase.marches, UseCase.fraude].includes(useCase!)) {
    return (
      <ProtectedBeneficiairesSection
        uniteLegale={uniteLegale}
        session={session}
        useCase={useCase!}
      />
    );
  }

  return (
    <Section
      title="Bénéficiaire(s) effectif(s)"
      id="beneficiaires"
      isProtected
      sources={[EAdministration.INPI]}
    >
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
        <a href="/cgu">à respecter nos conditions générales d’utilisations</a>.
      </p>
      <p>
        Toute demande d’accès aux données est tracée et envoyée à la comission
        européeene.
      </p>
      {useCase === UseCase.autre ? (
        <>
          <strong>
            Les informations des bénénficiaires effectifs ne vous sont pas
            accessibles.
          </strong>
        </>
      ) : (
        <AskUseCase onUseCaseChanged={setUseCase} />
      )}
    </Section>
  );
};

export default BeneficiairesSection;
