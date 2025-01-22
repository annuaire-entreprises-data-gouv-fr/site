'use client';

import { Section } from '#components/section';
import { AskUseCase } from '#components/section-with-use-case/ask-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { useState } from 'react';

type WrappedSectionProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
};

const DefaultIntroContent = () => (
  <p>
    Les agents publics peuvent demander à accéder à cette donnée uniquement dans
    les cas d’usages justifiant d’un intérêt légitime. En déclarant le cadre
    juridique dans lequel vous accédez à ces données, vous vous engagez{' '}
    <a href="/cgu">à respecter nos conditions générales d’utilisation</a>.
  </p>
);

const ProtectedSectionWithUseCase: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  title: string;
  id: string;
  sources: EAdministration[];
  allowedUseCases: UseCase[];
  requiredRight: ApplicationRights;
  noRightContent?: JSX.Element;
  useCaseFormContent?: JSX.Element;
  WrappedSection: React.ComponentType<WrappedSectionProps>;
}> = ({
  uniteLegale,
  session,
  title,
  id,
  sources,
  allowedUseCases,
  noRightContent,
  useCaseFormContent,
  requiredRight,
  WrappedSection,
}) => {
  const [useCase, setUseCase] = useState<UseCase>();

  if (!hasRights(session, requiredRight)) {
    return noRightContent ? (
      <Section title={title} id={id}>
        {noRightContent}
      </Section>
    ) : null;
  }

  if (!useCase) {
    return (
      <Section title={title} id={id} sources={sources} isProtected={true}>
        {useCaseFormContent || <DefaultIntroContent />}
        <AskUseCase idPrefix={id} useCase={useCase} setUseCase={setUseCase} />
      </Section>
    );
  }

  if (!allowedUseCases.includes(useCase)) {
    return (
      <Section title={title} id={id} sources={sources} isProtected={true}>
        {useCaseFormContent || <DefaultIntroContent />}
        <strong>
          Ces informations ne vous sont pas accessibles dans ce cas d‘usage.
        </strong>
      </Section>
    );
  }

  return (
    <WrappedSection
      uniteLegale={uniteLegale}
      session={session}
      useCase={useCase}
      title={title}
      id={id}
      sources={sources}
      isProtected={true}
    />
  );
};

export default ProtectedSectionWithUseCase;
