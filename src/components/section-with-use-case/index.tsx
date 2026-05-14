import { useState } from "react";
import { Link } from "#/components/Link";
import { Section } from "#/components/section";
import { AskUseCase } from "#/components/section-with-use-case/ask-use-case";
import type { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  type ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IEtablissement, IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";

interface WrappedSectionBaseProps {
  id: string;
  isProtected: boolean;
  sources: EAdministration[];
  title: string;
  useCase: UseCase;
  user: IAgentInfo | null;
}

interface WrappedSectionUniteLegaleProps extends WrappedSectionBaseProps {
  uniteLegale: IUniteLegale;
}

interface WrappedSectionEtablissementProps extends WrappedSectionBaseProps {
  etablissement: IEtablissement;
}

interface ProtectedSectionWithUseCaseBaseProps
  extends Pick<WrappedSectionBaseProps, "id" | "user" | "sources" | "title"> {
  allowedUseCases: UseCase[];
  noRightContent?: React.JSX.Element;
  requiredRight: ApplicationRights;
  useCaseFormContent?: React.JSX.Element;
}

interface ProtectedSectionWithUseCaseUniteLegaleProps
  extends ProtectedSectionWithUseCaseBaseProps {
  uniteLegale: IUniteLegale;
  WrappedSection: React.ComponentType<WrappedSectionUniteLegaleProps>;
}

interface ProtectedSectionWithUseCaseEtablissementProps
  extends ProtectedSectionWithUseCaseBaseProps {
  etablissement: IEtablissement;
  WrappedSection: React.ComponentType<WrappedSectionEtablissementProps>;
}

type ProtectedSectionWithUseCaseProps =
  | ProtectedSectionWithUseCaseUniteLegaleProps
  | ProtectedSectionWithUseCaseEtablissementProps;

const DefaultIntroContent = () => (
  <p>
    Les agents publics peuvent demander à accéder à cette donnée uniquement dans
    les cas d'usage justifiant d'un intérêt légitime. En déclarant le cadre
    juridique dans lequel vous accédez à ces données, vous vous engagez{" "}
    <Link to="/modalites-utilisation">
      à respecter nos modalités d'utilisation
    </Link>
    .
  </p>
);

const ProtectedSectionWithUseCase: React.FC<
  ProtectedSectionWithUseCaseProps
> = (props: ProtectedSectionWithUseCaseProps) => {
  const {
    user,
    title,
    id,
    sources,
    allowedUseCases,
    noRightContent,
    useCaseFormContent,
    requiredRight,
  } = props;
  const [useCase, setUseCase] = useState<UseCase>();

  if (!hasRights({ user }, requiredRight)) {
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

  if ("etablissement" in props) {
    const WrappedSection = props.WrappedSection;

    return (
      <WrappedSection
        etablissement={props.etablissement}
        id={id}
        isProtected
        sources={sources}
        title={title}
        useCase={useCase}
        user={user}
      />
    );
  }

  const WrappedSection = props.WrappedSection;

  return (
    <WrappedSection
      id={id}
      isProtected
      sources={sources}
      title={title}
      uniteLegale={props.uniteLegale}
      useCase={useCase}
      user={user}
    />
  );
};

export default ProtectedSectionWithUseCase;
