import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { UseCase } from '#models/user/agent';
import React, { useState } from 'react';
import { AskUseCase } from './ask-use-case';

interface UseCaseWrapperProps {
  title: string;
  id: string;
  sources?: EAdministration[];
  isProtected?: boolean;
  allowedUseCases?: UseCase[];
  children: (useCase: UseCase) => React.ReactNode;
  introContent?: React.ReactNode;
  deniedContent?: React.ReactNode;
}

const UseCaseWrapper: React.FC<UseCaseWrapperProps> = ({
  title,
  id,
  sources,
  isProtected = true,
  allowedUseCases = [UseCase.aides, UseCase.marches, UseCase.fraude],
  children,
  introContent,
  deniedContent,
}) => {
  const [useCase, setUseCase] = useState<UseCase>();

  const defaultDeniedContent = (
    <strong>
      Ces informations ne vous sont pas accessibles dans ce cas d‘usage.
    </strong>
  );

  if (useCase && allowedUseCases.includes(useCase)) {
    return (
      <Section
        title={title}
        id={id}
        isProtected={isProtected}
        sources={sources}
      >
        {children(useCase)}
      </Section>
    );
  }

  return (
    <Section title={title} id={id} isProtected={isProtected} sources={sources}>
      {introContent}
      {useCase === UseCase.autre ? (
        deniedContent || defaultDeniedContent
      ) : (
        <AskUseCase onUseCaseChanged={setUseCase} />
      )}
    </Section>
  );
};

export default UseCaseWrapper;
