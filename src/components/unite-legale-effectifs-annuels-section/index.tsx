import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import ProtectedUniteLegaleEffectifsAnnuelsSection from "./protected-effectifs-annuels-section";

interface IProps {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}

const UniteLegaleEffectifsAnnuelsSection = ({ uniteLegale, user }: IProps) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[
      UseCase.fraude,
      UseCase.marches,
      UseCase.subventionsFonctionnementAssociation,
      UseCase.aidesPubliques,
    ]}
    id="effectifs-annuels"
    requiredRight={ApplicationRights.effectifs}
    sources={[EAdministration.GIP_MDS]}
    title="Effectifs annuels"
    uniteLegale={uniteLegale}
    user={user}
    WrappedSection={ProtectedUniteLegaleEffectifsAnnuelsSection}
  />
);
export default UniteLegaleEffectifsAnnuelsSection;
