import { TwoColumnTable } from "#/components/table/simple";
import { Tag } from "#/components-ui/tag";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";

const formatAnnees = (annees: number[]) =>
  [...annees].sort((a, b) => b - a).join(", ") || "Aucune année déclarée";

export const NoIndicateursFinanciersFondation = () => (
  <p>
    Les indicateurs financiers du RNF n’ont pas été retrouvés pour cette
    fondation.
  </p>
);

export const NoConformiteComptableFondation = () => (
  <p>La conformité comptable n’a pas été retrouvée pour cette fondation.</p>
);

export function IndicateursFinanciersFondationContent({
  situationFinanciere,
}: Pick<IFondationsRestreintes, "situationFinanciere">) {
  return (
    <>
      <p>
        Années déclarées par la fondation au Répertoire national des fondations
        (RNF). Ces informations sont renseignées lorsque la fondation effectue
        la démarche correspondante ; une absence de déclaration ne signifie pas
        une absence de financement.
      </p>
      <TwoColumnTable
        body={[
          [
            "Subventions publiques",
            formatAnnees(situationFinanciere.anneesSubventionsPubliques),
          ],
          [
            "Appel à la générosité publique",
            formatAnnees(situationFinanciere.anneesAppelGenerositePublique),
          ],
          [
            "Financements étrangers",
            formatAnnees(situationFinanciere.anneesFinancementsEtrangers),
          ],
        ]}
        firstColumnWidth="50%"
      />
    </>
  );
}

export function ConformiteComptableFondationContent({
  conformiteComptable,
}: Pick<IFondationsRestreintes, "conformiteComptable">) {
  const { etatTransmissionComptes, anneesExercicesComptablesTransmis } =
    conformiteComptable;

  return (
    <>
      <p>État du dépôt des comptes annuels enregistré au RNF.</p>
      <TwoColumnTable
        body={[
          [
            "État de transmission des comptes",
            <Tag
              color={
                etatTransmissionComptes === "En règle" ? "success" : "warning"
              }
            >
              {etatTransmissionComptes}
            </Tag>,
          ],
          [
            "Exercices comptables transmis",
            formatAnnees(anneesExercicesComptablesTransmis),
          ],
        ]}
        firstColumnWidth="50%"
      />
      {etatTransmissionComptes === "En défaut" && (
        <p>Le RNF signale un retard dans le dépôt des comptes annuels.</p>
      )}
    </>
  );
}
