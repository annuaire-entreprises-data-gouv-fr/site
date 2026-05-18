import { DGFiP } from "#/components/administrations";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { AskUseCase } from "#/components/section-with-use-case/ask-use-case";
import { SimpleSeparator } from "#/components-ui/horizontal-separator";
import { useFetchFinancesSociete } from "#/hooks/fetch/indicateurs-financiers-societe";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { FinancesSocieteInnerSection } from "./inner-section";

const NotFoundInfo = ({
  setUseCase,
}: {
  setUseCase: (useCase: UseCase) => void;
}) => (
  <>
    Aucun indicateur financier n’a été retrouvé pour cette structure.
    <div style={{ marginTop: "30px" }}>
      Vos droits vous permettent d‘enrichir cette section avec les chiffres
      d‘affaires déclarés à la <DGFiP />.
      <AskUseCase idPrefix="finances-societe" setUseCase={setUseCase} />
    </div>
  </>
);

export function PublicFinancesSocieteSection({
  uniteLegale,
  user,
  setUseCase,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
  setUseCase: (useCase: UseCase) => void;
}) {
  const financesSociete = useFetchFinancesSociete(uniteLegale);

  return (
    <AsyncDataSectionClient
      data={financesSociete}
      id="indicateurs-financiers"
      isProtected={false}
      notFoundInfo={
        hasRights({ user }, ApplicationRights.chiffreAffaires) ? (
          <NotFoundInfo setUseCase={setUseCase} />
        ) : (
          "Aucun indicateur financier n’a été retrouvé pour cette structure."
        )
      }
      sources={[EAdministration.MEF, EAdministration.INPI]}
      title="Indicateurs financiers"
    >
      {(financesSociete) => (
        <>
          <FinancesSocieteInnerSection
            financesSociete={financesSociete}
            user={user}
          />
          <br />
          <SimpleSeparator />
          {hasRights({ user }, ApplicationRights.chiffreAffaires) && (
            <>
              <p>
                En tant qu’agent public, vous pouvez enrichir la section des
                indicateurs des bilans complets ou simplifiés avec les chiffres
                d‘affaires déclarés à la <DGFiP />, si votre cas d’usage le
                permet.
              </p>
              <AskUseCase idPrefix="finances-societe" setUseCase={setUseCase} />
            </>
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
}
