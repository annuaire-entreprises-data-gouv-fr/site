'use client';

import { Section } from '#components/section';
import { AskUseCase } from '#components/section-with-use-case/ask-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
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

const SectionWithUseCase: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
  allowedUseCases: UseCase[];
  hasRights: boolean;
  noRightContent?: JSX.Element;
  useCaseFormContent: JSX.Element;
  WrappedSection: React.ComponentType<WrappedSectionProps>;
}> = ({
  uniteLegale,
  session,
  title,
  id,
  sources,
  isProtected,
  allowedUseCases,
  noRightContent,
  useCaseFormContent,
  hasRights,
  WrappedSection,
}) => {
  const [useCase, setUseCase] = useState<UseCase>();

  if (!hasRights) {
    return noRightContent ? (
      <Section title={title} id={id}>
        {noRightContent}
      </Section>
    ) : null;
  }

  if (!useCase || !allowedUseCases.includes(useCase)) {
    return (
      <Section
        title={title}
        id={id}
        sources={sources}
        isProtected={isProtected}
      >
        <AskUseCase
          introContent={useCaseFormContent}
          useCase={useCase}
          setUseCase={setUseCase}
          allowedUseCases={allowedUseCases}
        />
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
      isProtected={isProtected}
    />
  );
};

export default SectionWithUseCase;
