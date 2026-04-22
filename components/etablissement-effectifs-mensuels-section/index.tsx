"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import type { TNatureEffectif } from "#clients/api-entreprise/effectifs/types";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IEtablissement } from "#models/core/types";
import { EffectifsMensuelsChartAndTable } from "./chart-and-table";

interface IProps {
  etablissement: IEtablissement;
  session: ISession | null;
}

const natureEffectifOptions: Record<TNatureEffectif, string> = {
  moyen: "Effectif moyen mensuel",
  boeth: "Bénéficiaires de l'OETH",
  ecap: "Emplois exigeant des conditions d'aptitude particulières",
  assujettissement_oeth: "Assujettissement OETH",
};

const natureEffectifValues = Object.keys(
  natureEffectifOptions
) as TNatureEffectif[];
const natureEffectifEntries: [TNatureEffectif, string][] = Object.entries(
  natureEffectifOptions
) as [TNatureEffectif, string][];

const EtablissementEffectifsMensuelsSection = ({
  etablissement,
  session,
}: IProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useQueryState(
    "effectifs-mensuels-annee",
    parseAsInteger.withDefault(currentYear)
  );
  const [selectedNatureEffectif, setSelectedNatureEffectif] = useQueryState(
    "effectifs-mensuels-nature-effectif",
    parseAsStringLiteral(natureEffectifValues).withDefault("moyen")
  );
  const natureEffectif: TNatureEffectif = selectedNatureEffectif;
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const year = currentYear - index;

        return {
          label: year.toString(),
          value: year.toString(),
        };
      }),
    [currentYear]
  );
  const options = useMemo(
    () => ({
      params: {
        natureEffectif,
        year: selectedYear.toString(),
      },
    }),
    [natureEffectif, selectedYear]
  );
  const effectifsMensuelsProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentEffectifsMensuelsProtected,
    etablissement.siret,
    session,
    options
  );

  return (
    <AsyncDataSectionClient
      data={effectifsMensuelsProtected}
      header={
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
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
      id="effectifs-mensuels"
      isProtected
      loadingMinHeight={600}
      notFoundInfo="Aucun effectif mensuel n'a été retrouvé pour cet établissement avec les filtres sélectionnés."
      sources={[EAdministration.GIP_MDS]}
      title="Effectifs mensuels"
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
export default EtablissementEffectifsMensuelsSection;
