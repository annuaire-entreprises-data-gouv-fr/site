import { ClientOnly } from "@tanstack/react-router";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import type { IGeoElement } from "#/clients/geo";
import { useStorage } from "#/hooks";
import { isAPI404, isAPINotResponding } from "#/models/api-not-responding";
import { searchGeoElementByText } from "#/models/geo";

const groupLabels: Record<IGeoElement["type"], string> = {
  insee: "Communes",
  cp: "Codes postaux",
  dep: "Départements",
  reg: "Régions",
  epci: "Intercommunalités",
};

export const FilterGeo = ({
  cp_dep = "",
  cp_dep_label = "",
  cp_dep_type = "",
}: {
  cp_dep?: string;
  cp_dep_label?: string;
  cp_dep_type?: string;
}) => {
  const [selected, setSelected] = useState<IGeoElement | null>(
    cp_dep
      ? {
          value: cp_dep,
          label: cp_dep_label,
          type: cp_dep_type as IGeoElement["type"],
        }
      : null
  );
  const [history, setHistory] = useStorage("local", "geo-search-history-4", []);
  const [error, setError] = useState(false);
  const loadOptions = async (term: string) => {
    setError(false);
    try {
      const results = await searchGeoElementByText(term);
      if (isAPI404(results)) {
        return [];
      }
      if (isAPINotResponding(results)) {
        setError(true);
        return [];
      }
      return Object.entries(groupLabels)
        .map(([type, label]) => ({
          label,
          options: results.filter((item) => item.type === type),
        }))
        .filter((group) => group.options.length > 0);
    } catch {
      setError(true);
      return [];
    }
  };
  return (
    <>
      <ClientOnly>
        <AsyncSelect<IGeoElement>
          defaultOptions={[
            { label: "Localisations récentes", options: history },
          ]}
          getOptionValue={(item) => `${item.type}-${item.value}`}
          inputId="geo-search-input"
          instanceId="geo-search"
          isClearable
          loadingMessage={() => "Recherche en cours…"}
          loadOptions={loadOptions}
          noOptionsMessage={() =>
            error
              ? "Recherche géographique momentanément indisponible"
              : "Aucune localisation trouvée"
          }
          onChange={(item) => {
            setSelected(item);
            if (item) {
              setHistory(
                [
                  item,
                  ...history.filter(
                    (previous: IGeoElement) =>
                      previous.value !== item.value ||
                      previous.type !== item.type
                  ),
                ].slice(0, 4)
              );
            }
          }}
          placeholder="ex : Rennes"
          value={selected}
        />
      </ClientOnly>
      <input
        name="cp_dep_label"
        readOnly
        type="hidden"
        value={selected?.label ?? ""}
      />
      <input
        name="cp_dep_type"
        readOnly
        type="hidden"
        value={selected?.type ?? ""}
      />
      <input
        name="cp_dep"
        readOnly
        type="hidden"
        value={selected?.value ?? ""}
      />
    </>
  );
};
