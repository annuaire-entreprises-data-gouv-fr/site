import { useMemo } from "react";
import { Link } from "#/components/link";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import ProtectedSectionWithUseCase, {
  type WrappedSectionFondationProps,
} from "#/components/section-with-use-case";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IFondation } from "#/models/core/fondations.types";
import { UseCase } from "#/models/use-cases";
import { getAgentFondationsRestreintesFn } from "#/server-functions/agent/data-fetching";
import { DirigeantsFondationContent, NoDirigeantsFondation } from "./content";

function ProtectedDirigeantsFondationSection({
  fondation,
  useCase,
  id,
  title,
  sources,
  isProtected,
}: WrappedSectionFondationProps) {
  const input = useMemo(
    () => ({ idRnf: fondation.id, useCase }),
    [fondation.id, useCase]
  );
  const data = useServerFnData(
    getAgentFondationsRestreintesFn,
    input,
    ApplicationRights.isAgent
  );

  return (
    <AsyncDataSectionClient
      data={data}
      id={id}
      isProtected={isProtected}
      notFoundInfo={<NoDirigeantsFondation />}
      sources={sources}
      title={title}
    >
      {({ dirigeants }) => (
        <DirigeantsFondationContent dirigeants={dirigeants} />
      )}
    </AsyncDataSectionClient>
  );
}

export default function DirigeantsFondationSection({
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
      id="dirigeants-fondation"
      noRightContent={
        <p>
          Les informations sur les dirigeants de cette fondation sont réservées
          aux agents publics.{" "}
          <Link params={{ slug: "agent-public" }} to="/lp/$slug">
            Connectez-vous
          </Link>{" "}
          pour y accéder.
        </p>
      }
      requiredRight={ApplicationRights.isAgent}
      sources={[EAdministration.SIAF]}
      title="Dirigeants de la fondation"
      user={user}
      WrappedSection={ProtectedDirigeantsFondationSection}
    />
  );
}
