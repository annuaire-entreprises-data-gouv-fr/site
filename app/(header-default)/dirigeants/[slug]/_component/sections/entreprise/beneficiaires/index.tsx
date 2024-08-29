'use client';

import { Warning } from '#components-ui/alerts';
import { INPI } from '#components/administrations';
import AgentWall from '#components/espace-agent-components/agent-wall';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { resetAgentUseCase, setAgentUseCase } from '#models/user/helpers';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { fetchAPIRoute } from 'hooks/fetch/use-API-route-data';
import { useMemo, useState } from 'react';
import ProtectedBeneficiairesSection from './agent-section';
import { AskUseCase } from './ask-use-case';
import ResetUseCase from './reset-use-case';

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
}> = ({ uniteLegale, session: baseSession }) => {
  const { session, saveUseCase, resetUseCase } = useUseCase(baseSession);

  if (!hasRights(session, EScope.isAgent)) {
    return (
      <AgentWall
        title="Bénéficiaire(s) effectif(s)"
        id="beneficiaires"
        sectionIntro={
          <>
            <WarningRBE />
            <br />
          </>
        }
        sources={[EAdministration.INPI]}
        conditionExplanation={
          <>
            Disponible pour les <strong>administrations légitimes</strong>{' '}
            (attribution d’
            <strong>aides publiques</strong>, <strong>marchés publics</strong>{' '}
            et <strong>lutte contre la fraude</strong>).
          </>
        }
      />
    );
  }

  if (hasRights(session, EScope.beneficiaires)) {
    return (
      <ProtectedBeneficiairesSection
        uniteLegale={uniteLegale}
        session={session}
        onUseCaseReset={resetUseCase}
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
      {session && session?.user?.useCase === UseCase.autre ? (
        <>
          <strong>
            Les informations des bénénficiaires effectifs ne sont pas
            accessibles.
          </strong>
          <ResetUseCase session={session} onUseCaseReset={resetUseCase} />
        </>
      ) : (
        <AskUseCase session={session} onUseCaseChanged={saveUseCase} />
      )}
    </Section>
  );
};

function useUseCase(baseSession: ISession | null) {
  const [useCase, setUseCase] = useState(baseSession?.user?.useCase || null);

  function saveUseCase(useCase: UseCase) {
    fetchAPIRoute('espace-agent/save-use-case', useCase, session).then(() =>
      setUseCase(useCase)
    );
  }

  function resetUseCase() {
    setUseCase(null);
  }

  const session = useMemo(() => {
    if (!baseSession) {
      return null;
    }
    if (useCase) {
      return { ...setAgentUseCase(useCase, baseSession) };
    } else {
      return { ...resetAgentUseCase(baseSession) };
    }
  }, [baseSession, useCase]);

  return { session, saveUseCase, resetUseCase };
}

export default BeneficiairesSection;
