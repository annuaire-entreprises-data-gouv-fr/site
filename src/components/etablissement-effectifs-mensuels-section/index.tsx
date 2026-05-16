import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IEtablissement } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import ProtectedEtablissementEffectifsMensuelsSection from "./protected-effectifs-mensuels-section";

interface IProps {
  etablissement: IEtablissement;
  user: IAgentInfo | null;
}

const EtablissementEffectifsMensuelsSection = ({
  etablissement,
  user,
}: IProps) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[
      UseCase.fraude,
      UseCase.marches,
      UseCase.subventionsFonctionnementAssociation,
      UseCase.aidesPubliques,
    ]}
    etablissement={etablissement}
    id="effectifs-mensuels"
    requiredRight={ApplicationRights.effectifs}
    sources={[EAdministration.DGFIP]}
    title="Effectifs mensuels"
    user={user}
    WrappedSection={ProtectedEtablissementEffectifsMensuelsSection}
  />
);
export default EtablissementEffectifsMensuelsSection;
