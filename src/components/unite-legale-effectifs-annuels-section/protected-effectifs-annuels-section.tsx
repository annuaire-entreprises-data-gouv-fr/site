import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import type { TNatureEffectif } from "#/clients/api-entreprise/effectifs/types";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import type { EAdministration } from "#/models/administrations/e-administration";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { getAgentEffectifsAnnuelsProtectedFn } from "#/server-functions/agent/data-fetching";
import {
  EffectifsAnnuelsChartAndTable,
  filterEffectifsAnnuelsWithData,
} from "./chart-and-table";

interface IProps {
  id: string;
  isProtected: boolean;
  sources: EAdministration[];
  title: string;
  uniteLegale: IUniteLegale;
  useCase: UseCase;
}

const profondeur = 5;

const natureEffectifOptions: Record<TNatureEffectif, string> = {
  moyen: "Effectif moyen annuel",
  boeth: "Bénéficiaires de l'OETH",
  ecap: "Emplois exigeant des conditions d'aptitude particulières",
  assujettissement_oeth: "Assujettissement OETH",
};

export const natureEffectifAnnuelValues = Object.keys(
  natureEffectifOptions
) as TNatureEffectif[];
const natureEffectifEntries: [TNatureEffectif, string][] = Object.entries(
  natureEffectifOptions
) as [TNatureEffectif, string][];

const entrepriseRoute = getRouteApi("/_header-default/entreprise/$slug");

const ProtectedUniteLegaleEffectifsAnnuelsSection = ({
  id,
  isProtected,
  sources,
  title,
  uniteLegale,
  useCase,
}: IProps) => {
  const { "effectifs-annuels-nature-effectif": selectedNatureEffectif } =
    entrepriseRoute.useSearch();
  const navigate = entrepriseRoute.useNavigate();

  const onNatureEffectifChange = useCallback(
    (natureEffectif: TNatureEffectif) => {
      navigate({
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          "effectifs-annuels-nature-effectif": natureEffectif,
        }),
      });
    },
    [navigate]
  );

  const input = useMemo(
    () => ({
      siren: uniteLegale.siren,
      natureEffectif: selectedNatureEffectif,
      profondeur,
      useCase,
    }),
    [selectedNatureEffectif, uniteLegale.siren, useCase]
  );
  const effectifsAnnuelsProtected = useServerFnData(
    getAgentEffectifsAnnuelsProtectedFn,
    input
  );

  return (
    <AsyncDataSectionClient
      data={effectifsAnnuelsProtected}
      header={
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
          <div className="fr-col-12">
            <p>
              Effectifs annuels des régimes général et agricole d'une unité
              légale, issus de l'Urssaf et de la MSA depuis le répertoire commun
              des déclarants opéré par le GIP-MDS.
            </p>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-select-group">
              <label
                className="fr-label"
                htmlFor="effectifs-annuels-nature-filter"
              >
                Nature d'effectif
              </label>
              <select
                className="fr-select"
                id="effectifs-annuels-nature-filter"
                onChange={(event) => {
                  onNatureEffectifChange(
                    event.currentTarget.value as TNatureEffectif
                  );
                }}
                value={selectedNatureEffectif}
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
      notFoundInfo="Aucun effectif annuel n'a été retrouvé pour cette entreprise avec le filtre sélectionné."
      sources={sources}
      title={title}
    >
      {(effectifsAnnuelsProtected) => (
        <EffectifsAnnuelsChartAndTable
          effectifsAnnuels={filterEffectifsAnnuelsWithData(
            effectifsAnnuelsProtected
          )}
        />
      )}
    </AsyncDataSectionClient>
  );
};
export default ProtectedUniteLegaleEffectifsAnnuelsSection;
