import { useMemo, useState } from "react";
import type { TNatureEffectif } from "#/clients/api-entreprise/effectifs/types";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { useServerActionData } from "#/hooks/fetch/use-server-action-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IEtablissement } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { getEspaceAgentEffectifsMensuelsProtected } from "#/server-functions/agent/data-fetching";
import { EffectifsMensuelsChartAndTable } from "./chart-and-table";

interface IProps {
  etablissement: IEtablissement;
  id: string;
  isProtected: boolean;
  sources: EAdministration[];
  title: string;
  useCase: UseCase;
  user: IAgentInfo | null;
}

const natureEffectifOptions: Record<TNatureEffectif, string> = {
  moyen: "Effectif moyen mensuel",
  boeth: "Bénéficiaires de l'OETH",
  ecap: "Emplois exigeant des conditions d'aptitude particulières",
  assujettissement_oeth: "Assujettissement OETH",
};

// const natureEffectifValues = Object.keys(
//   natureEffectifOptions
// ) as TNatureEffectif[];
const natureEffectifEntries: [TNatureEffectif, string][] = Object.entries(
  natureEffectifOptions
) as [TNatureEffectif, string][];

const ProtectedEtablissementEffectifsMensuelsSection = ({
  etablissement,
  user,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: IProps) => {
  const currentYear = new Date().getFullYear();
  // TODO remigrate to nuqs like query binding
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedNatureEffectif, setSelectedNatureEffectif] = useState(
    "moyen" as TNatureEffectif
  );
  const natureEffectif: TNatureEffectif = selectedNatureEffectif;
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const year = currentYear - index;

        return {
          label: year.toString(),
          value: year.toString(),
        };
      }),
    [currentYear]
  );
  const input = useMemo(
    () => ({
      siret: etablissement.siret,
      natureEffectif,
      year: selectedYear.toString(),
      useCase,
    }),
    [natureEffectif, selectedYear, useCase]
  );
  const effectifsMensuelsProtected = useServerActionData(
    getEspaceAgentEffectifsMensuelsProtected,
    user,
    input
  );

  return (
    <AsyncDataSectionClient
      data={effectifsMensuelsProtected}
      header={
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
          <div className="fr-col-12">
            <p>
              Effectifs mensuels des régimes général et agricole d'un
              établissement, issus de l'Urssaf et de la MSA depuis le répertoire
              commun des déclarants opéré par le GIP-MDS.
            </p>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-select-group">
              <label
                className="fr-label"
                htmlFor="effectifs-mensuels-year-filter"
              >
                Année
              </label>
              <select
                className="fr-select"
                id="effectifs-mensuels-year-filter"
                onChange={(event) => {
                  setSelectedYear(
                    Number.parseInt(event.currentTarget.value, 10)
                  );
                }}
                value={selectedYear.toString()}
              >
                {yearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-select-group">
              <label
                className="fr-label"
                htmlFor="effectifs-mensuels-nature-filter"
              >
                Nature d'effectif
              </label>
              <select
                className="fr-select"
                id="effectifs-mensuels-nature-filter"
                onChange={(event) => {
                  setSelectedNatureEffectif(
                    event.currentTarget.value as TNatureEffectif
                  );
                }}
                value={natureEffectif}
              >
                {natureEffectifEntries.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
      id={id}
      isProtected={isProtected}
      loadingMinHeight={600}
      notFoundInfo="Aucun effectif mensuel n'a été retrouvé pour cet établissement avec les filtres sélectionnés."
      sources={sources}
      title={title}
    >
      {(effectifsMensuelsProtected) => (
        <EffectifsMensuelsChartAndTable
          effectifsRegimeAgricole={
            effectifsMensuelsProtected.effectifsRegimeAgricole
          }
          effectifsRegimeGeneral={
            effectifsMensuelsProtected.effectifsRegimeGeneral
          }
        />
      )}
    </AsyncDataSectionClient>
  );
};
export default ProtectedEtablissementEffectifsMensuelsSection;
