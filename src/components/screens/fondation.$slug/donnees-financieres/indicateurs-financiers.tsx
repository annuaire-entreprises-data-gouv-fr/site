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
import {
  IndicateursFinanciersFondationContent,
  NoIndicateursFinanciersFondation,
} from "./content";

function ProtectedIndicateursFinanciersFondationSection({
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
      notFoundInfo={<NoIndicateursFinanciersFondation />}
      sources={sources}
      title={title}
    >
      {({ situationFinanciere }) => (
        <IndicateursFinanciersFondationContent
          situationFinanciere={situationFinanciere}
        />
      )}
    </AsyncDataSectionClient>
  );
}

export default function IndicateursFinanciersFondationSection({
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
      id="indicateurs-financiers-rnf"
      noRightContent={
        <p>
          Ces informations du RNF sont réservées aux agents publics.{" "}
          <Link params={{ slug: "agent-public" }} to="/lp/$slug">
            Connectez-vous
          </Link>{" "}
          pour y accéder.
        </p>
      }
      requiredRight={ApplicationRights.isAgent}
      sources={[EAdministration.SIAF]}
      title="Indicateurs financiers du RNF"
      user={user}
      WrappedSection={ProtectedIndicateursFinanciersFondationSection}
    />
  );
}
