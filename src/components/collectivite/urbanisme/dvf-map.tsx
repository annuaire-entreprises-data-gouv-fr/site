import { useMemo } from "react";
import type { IGeoCommune } from "#/clients/api-geo/interface";
import { CollectiviteMap } from "#/components/collectivite/map";
import { Section } from "#/components/section";
import { Info } from "#/components-ui/alerts";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getDVFCommuneCodes } from "#/models/collectivite/dvf";
import { getDVFReferencePrices } from "#/models/collectivite/dvf-mutations";
import { isDataSuccess } from "#/models/data-fetching";
import { getCollectiviteDVFFn } from "#/server-functions/public/data-fetching/collectivites";
import { departementWithoutDVFData } from "./dvf";
import styles from "./dvf-map.module.css";
import {
  type DVFColorMode,
  DVFMapLegend,
  dvfTypeFilters,
} from "./dvf-map-legend";
import { DVFParcellePanel } from "./dvf-parcelle-panel";
import {
  type DVFPriceStatus,
  dvfParcellesMinZoom,
  useDVFMap,
} from "./use-dvf-map";

const colorModes: { label: string; value: DVFColorMode }[] = [
  { value: "type", label: "Type de bien" },
  { value: "prix", label: "Prix au m²" },
];

const priceStatusMessages: Partial<Record<DVFPriceStatus, string>> = {
  zoom: "Zoomez sur un quartier pour comparer les prix des parcelles visibles.",
  "too-many":
    "Trop de sections cadastrales sont visibles : zoomez pour charger les prix.",
  loading: "Chargement des ventes des parcelles visibles…",
  error: "Impossible de charger les ventes des parcelles visibles.",
};

function DVFMap({
  codeInsee,
  geoCommune,
}: {
  codeInsee: string;
  geoCommune: IGeoCommune;
}) {
  const communeCodes = useMemo(
    () => getDVFCommuneCodes(codeInsee),
    [codeInsee]
  );
  const input = useMemo(() => ({ codeInsee }), [codeInsee]);
  // Même requête que la section des prix : la réponse est partagée en cache
  const dvf = useServerFnData(
    getCollectiviteDVFFn,
    input,
    ApplicationRights.opendata,
    { staleTime: 5 * 60 * 1000 }
  );
  const communeReferences = useMemo(
    () => (isDataSuccess(dvf) ? getDVFReferencePrices(dvf.indicateurs) : null),
    [dvf]
  );

  const {
    clearSelection,
    colorMode,
    onMapLoad,
    onMapUnload,
    priceStatus,
    references,
    selection,
    setColorMode,
    setTypeFilter,
    typeFilter,
    zoom,
    zoomToParcelles,
  } = useDVFMap({ communeCodes, communeReferences });

  const statusMessage =
    zoom !== null && zoom < dvfParcellesMinZoom
      ? "Zoomez dans la commune pour afficher les parcelles vendues."
      : priceStatusMessages[priceStatus];

  return (
    <>
      <p>
        Explorez les ventes immobilières des cinq dernières années, parcelle par
        parcelle. Cliquez sur une parcelle pour consulter le détail de chaque
        vente (prix, surfaces, composition) et le comparer aux prix médians de
        la commune.
      </p>
      <div className={styles.controls}>
        <fieldset className={styles.segmented}>
          <legend>Biens vendus</legend>
          <div>
            {dvfTypeFilters.map(({ label, value }) => (
              <button
                aria-pressed={typeFilter === value}
                className={
                  typeFilter === value ? styles.activeOption : styles.option
                }
                key={value}
                onClick={() => setTypeFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.segmented}>
          <legend>Couleur des parcelles</legend>
          <div>
            {colorModes.map(({ label, value }) => (
              <button
                aria-pressed={colorMode === value}
                className={
                  colorMode === value ? styles.activeOption : styles.option
                }
                key={value}
                onClick={() => setColorMode(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <div className={styles.mapLayout}>
        {selection.state !== "idle" && (
          <div className={styles.detailsOverlay}>
            <DVFParcellePanel
              onClose={clearSelection}
              references={references}
              selection={selection}
              typeFilter={typeFilter}
            />
          </div>
        )}
        {statusMessage && (
          <div className={styles.mapStatus} role="status">
            {statusMessage}
            {(priceStatus === "zoom" || priceStatus === "too-many") &&
              zoom !== null &&
              zoom >= dvfParcellesMinZoom && (
                <button
                  className={styles.mapStatusButton}
                  onClick={zoomToParcelles}
                  type="button"
                >
                  Zoomer
                </button>
              )}
          </div>
        )}
        <CollectiviteMap
          geoCommune={geoCommune}
          onMapReady={onMapLoad}
          onMapUnload={onMapUnload}
          withSearch
        />
      </div>
      <DVFMapLegend colorMode={colorMode} references={references} />
      <p className={styles.note}>
        Une vente peut regrouper plusieurs locaux (appartement, cave, garage…)
        et plusieurs parcelles : la valeur foncière porte sur l’ensemble. Le
        prix au m² rapporte cette valeur à la surface bâtie des maisons,
        appartements ou locaux vendus ; il n’est pas comparé lorsque plusieurs
        biens principaux sont vendus ensemble. Les ventes de terrains seuls, les
        échanges et les adjudications sont affichés sans comparaison.
      </p>
    </>
  );
}

export function CollectiviteDVFMapSection({
  codeDepartement,
  codeInsee,
  geoCommune,
}: {
  codeDepartement: string;
  codeInsee: string;
  geoCommune: IGeoCommune;
}) {
  return (
    <Section
      id="carte-transactions-immobilieres"
      sources={[EAdministration.DGFIP, EAdministration.DINUM]}
      title="Carte des ventes immobilières (DVF)"
    >
      {departementWithoutDVFData.includes(codeDepartement) ? (
        <Info>
          Les données DVF ne sont pas disponibles en Alsace-Moselle (Bas-Rhin,
          Haut-Rhin et Moselle), où la publicité foncière relève du livre
          foncier, ni à Mayotte. Aucune vente ne peut donc être affichée pour
          cette commune.
        </Info>
      ) : (
        <DVFMap codeInsee={codeInsee} geoCommune={geoCommune} />
      )}
    </Section>
  );
}
