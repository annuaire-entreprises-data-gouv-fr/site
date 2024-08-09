'use client';

import { useState } from 'react';
import { Warning } from '#components-ui/alerts';
import { MultiChoice } from '#components-ui/multi-choice';
import { INPI } from '#components/administrations';
import AgentWall from '#components/espace-agent-components/agent-wall';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { IImmatriculationRNE } from '#models/immatriculation';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import ProtectedBeneficiairesSection from './agent-section';

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IDataFetchingState;
  uniteLegale: IUniteLegale;
};

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
  const [useCase, setUseCase] = useState('');

  if (!hasRights(session, EScope.beneficiaires)) {
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

  return (
    <>
      {!useCase ? (
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
            Les agents publics peuvent y accéder uniquement dans les cas
            d’usages justifiant d’un intérêt légitime. En déclarant le cadre
            juridique dans lequel vous accédez à ces données, vous vous engagez{' '}
            <a href="/cgu">
              à respecter nos conditions générales d’utilisations
            </a>
            .
          </p>
          <p>
            Toute demande d’accès aux données est tracée et envoyée à la
            comission européeene.
          </p>
          <label>Dans quel cadre souhaitez vous accéder à ces données ?</label>
          <br />
          <MultiChoice
            idPrefix="user-type"
            values={[
              {
                label: 'Aides publiques',
                onClick: () => setUseCase('aides'),
                checked: useCase === 'aides',
              },
              {
                label: 'Marchés publics',
                onClick: () => setUseCase('marchés'),
                checked: useCase === 'marchés',
              },
              {
                label: 'Lutte contre la fraude',
                onClick: () => setUseCase('fraude'),
                checked: useCase === 'fraude',
              },
              {
                label: 'Autre cas d’usage',
                onClick: () => setUseCase('autre'),
                checked: useCase === 'autre',
              },
            ]}
          />
        </Section>
      ) : useCase === 'autre' ? (
        <Section
          title="Bénéficiaire(s) effectif(s)"
          id="beneficiaires"
          isProtected
          sources={[EAdministration.INPI]}
        >
          Les informations des bénénficiaires effectifs ne sont pas accesibles
        </Section>
      ) : (
        <ProtectedBeneficiairesSection
          uniteLegale={uniteLegale}
          useCase={useCase}
          session={session}
        />
      )}
    </>
  );
};

export default BeneficiairesSection;
