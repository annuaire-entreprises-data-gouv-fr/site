import FAQLink from "#components-ui/faq-link";
import type { ISession } from "#models/authentication/user/session";
import type { IIndicateursFinanciersSociete } from "#models/finances-societe/types";
import { pluralize } from "#utils/helpers";
import { FinancesSocieteChartAndTable } from "./chart-and-table";

export const FinancesSocieteInnerSection = ({
  financesSociete,
  session,
}: {
  financesSociete: IIndicateursFinanciersSociete;
  session: ISession | null;
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
          session={session}
          indicateurs={financesSociete.indicateurs.filter(
            (b) => b.estConsolide
          )}
          estBilanConsolide={true}
          hasCADGFiP={false}
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
      session={session}
      indicateurs={financesSociete.indicateurs.filter((b) => !b.estConsolide)}
      hasCADGFiP={financesSociete.hasCADGFiP}
      estBilanConsolide={false}
    />
  </>
);
