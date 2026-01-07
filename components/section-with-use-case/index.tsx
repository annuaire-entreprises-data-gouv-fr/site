"use client";

import { useState } from "react";
import { Link } from "#components/Link";
import { Section } from "#components/section";
import { AskUseCase } from "#components/section-with-use-case/ask-use-case";
import type { EAdministration } from "#models/administrations/EAdministration";
import {
  type ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { UseCase } from "#models/use-cases";

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
    les cas d'usage justifiant d'un intérêt légitime. En déclarant le cadre
    juridique dans lequel vous accédez à ces données, vous vous engagez{" "}
    <Link href="/modalites-utilisation">
      à respecter nos modalités d'utilisation
    </Link>
    .
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
  noRightContent?: React.JSX.Element;
  useCaseFormContent?: React.JSX.Element;
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
      <Section id={id} title={title}>
        {noRightContent}
      </Section>
    ) : null;
  }

  if (!useCase) {
    return (
      <Section id={id} isProtected={true} sources={sources} title={title}>
        {useCaseFormContent || <DefaultIntroContent />}
        <AskUseCase idPrefix={id} setUseCase={setUseCase} useCase={useCase} />
      </Section>
    );
  }

  if (!allowedUseCases.includes(useCase)) {
    return (
      <Section id={id} isProtected={true} sources={sources} title={title}>
        {useCaseFormContent || <DefaultIntroContent />}
        <strong>
          Ces informations ne vous sont pas accessibles dans ce cas d‘usage.
        </strong>
      </Section>
    );
  }

  return (
    <WrappedSection
      id={id}
      isProtected={true}
      session={session}
      sources={sources}
      title={title}
      uniteLegale={uniteLegale}
      useCase={useCase}
    />
  );
};

export default ProtectedSectionWithUseCase;
