import { Link } from "#/components/link";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import ProtectedSectionWithUseCase, {
  type WrappedSectionFondationProps,
} from "#/components/section-with-use-case";
import { useFondationsRestreintes } from "#/hooks/fetch/fondations-restreintes";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import { LiensFondationContent, NoLiensFondation } from "./content";

function ProtectedLiensFondationSection({
  fondation,
  useCase,
  id,
  title,
  sources,
  isProtected,
}: WrappedSectionFondationProps) {
  const data = useFondationsRestreintes(fondation.id, useCase);

  return (
    <AsyncDataSectionClient
      data={data}
      id={id}
      isProtected={isProtected}
      notFoundInfo={<NoLiensFondation />}
      sources={sources}
      title={title}
    >
      {({ filiation }) => <LiensFondationContent filiation={filiation} />}
    </AsyncDataSectionClient>
  );
}

export default function LiensFondationSection({
  fondation,
  user,
}: {
  fondation: IFondation;
  user: IAgentInfo | null;
}) {
  return (
    <ProtectedSectionWithUseCase
      allowedUseCases={Object.values(UseCase)}
      fondation={fondation}
      id="liens-fondation"
      noRightContent={
        <p>
          Les informations sur les liens de cette fondation sont réservées aux
          agents publics.{" "}
          <Link params={{ slug: "agent-public" }} to="/lp/$slug">
            Connectez-vous
          </Link>{" "}
          pour y accéder.
        </p>
      }
      requiredRight={ApplicationRights.isAgent}
      sources={[EAdministration.SIAF]}
      title="Liens entre organismes"
      user={user}
      WrappedSection={ProtectedLiensFondationSection}
    />
  );
}
