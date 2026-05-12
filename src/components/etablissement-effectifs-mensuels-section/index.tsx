import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/EAdministration";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { ISession } from "#/models/authentication/user/session";
import type { IEtablissement } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import ProtectedEtablissementEffectifsMensuelsSection from "./protected-effectifs-mensuels-section";

interface IProps {
  etablissement: IEtablissement;
  session: ISession | null;
}

const EtablissementEffectifsMensuelsSection = ({
  etablissement,
  session,
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
    session={session}
    sources={[EAdministration.DGFIP]}
    title="Effectifs mensuels"
    WrappedSection={ProtectedEtablissementEffectifsMensuelsSection}
  />
);
export default EtablissementEffectifsMensuelsSection;
