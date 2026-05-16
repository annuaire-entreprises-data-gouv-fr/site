import FAQLink from "#/components-ui/faq-link";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IIndicateursFinanciersSociete } from "#/models/finances-societe/types";
import { pluralize } from "#/utils/helpers";
import { FinancesSocieteChartAndTable } from "./chart-and-table";

export const FinancesSocieteInnerSection = ({
  financesSociete,
  user,
}: {
  financesSociete: IIndicateursFinanciersSociete;
  user: IAgentInfo | null;
}) => (
  <>
    <p>
      Cette entreprise possède des indicateurs financiers pour{" "}
      {financesSociete.indicateurs.length} bilan
      {pluralize(financesSociete.indicateurs)} déposé
      {pluralize(financesSociete.indicateurs)} au RNE :
    </p>
    {financesSociete.hasBilanConsolide && (
      <>
        <h3>
          Bilans{" "}
          <FAQLink tooltipLabel="Consolidés">
            Une entreprise peut déposer différents types de bilans :
            <ul>
              <li>simplifié : un bilan allégé</li>
              <li>complet : le bilan classique</li>
              <li>
                consolidé : un bilan qui intègre les données des filiales d’un
                groupe
              </li>
            </ul>
          </FAQLink>
        </h3>
        <FinancesSocieteChartAndTable
          estBilanConsolide={true}
          hasCADGFiP={false}
          indicateurs={financesSociete.indicateurs.filter(
            (b) => b.estConsolide
          )}
          user={user}
        />
      </>
    )}
    <h3>
      Bilans{" "}
      <FAQLink tooltipLabel="Complets ou Simplifiés">
        Une entreprise peut déposer différents types de bilans :
        <ul>
          <li>simplifié : un bilan allégé</li>
          <li>complet : le bilan classique</li>
          <li>
            consolidé : un bilan qui intègre les données des filiales d’un
            groupe
          </li>
        </ul>
      </FAQLink>
    </h3>
    <FinancesSocieteChartAndTable
      estBilanConsolide={false}
      hasCADGFiP={financesSociete.hasCADGFiP}
      indicateurs={financesSociete.indicateurs.filter((b) => !b.estConsolide)}
      user={user}
    />
  </>
);
