import { useMemo } from "react";
import {
  type DVFVenteCategorie,
  getEcartReference,
  type IDVFLocal,
  type IDVFReferencePrices,
  type IDVFVente,
  median,
} from "#/models/collectivite/dvf-mutations";
import { formatDate, formatNumber } from "#/utils/helpers";
import { formatDVFPrice, formatDVFPriceEvolution } from "./chart-data";
import styles from "./dvf-map.module.css";
import {
  type DVFTypeFilter,
  dvfCategorieColors,
  dvfEcartClasses,
} from "./dvf-map-legend";
import { type DVFParcelleSelection, filterVentes } from "./use-dvf-map";

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const surfaceFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

const categorieLabels: Record<DVFVenteCategorie, string> = {
  maison: "Maison",
  appartement: "Appartement",
  local: "Local industriel ou commercial",
  mixte: "Plusieurs types de biens",
  dependance: "Dépendance",
  terrain: "Terrain",
};

const categorieColors: Record<DVFVenteCategorie, string> = {
  maison: dvfCategorieColors.maison,
  appartement: dvfCategorieColors.appartement,
  local: dvfCategorieColors.local,
  mixte: dvfCategorieColors.mixte,
  dependance: dvfCategorieColors.autre,
  terrain: dvfCategorieColors.autre,
};

const localLabels: Record<IDVFLocal["type"], string> = {
  maison: "Maison",
  appartement: "Appartement",
  local: "Local",
  dependance: "Dépendance",
};

function formatSurface(value: number) {
  return `${surfaceFormatter.format(value)} m²`;
}

/** Ex : « 1 maison · 4 pièces · 92 m² » ou « 2 dépendances » */
function formatLocaux(locaux: IDVFLocal[]) {
  const dependances = locaux.filter(({ type }) => type === "dependance");
  const principaux = locaux
    .filter(({ type }) => type !== "dependance")
    .map(({ type, nombrePieces, surfaceBati, surfaceCarrez }) =>
      [
        localLabels[type],
        nombrePieces
          ? `${nombrePieces} pièce${nombrePieces > 1 ? "s" : ""}`
          : null,
        surfaceBati ? formatSurface(surfaceBati) : null,
        surfaceCarrez ? `Carrez ${formatSurface(surfaceCarrez)}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    );
  if (dependances.length > 0) {
    principaux.push(
      `${dependances.length} dépendance${dependances.length > 1 ? "s" : ""}`
    );
  }
  return principaux;
}

function getEcartClassIndex(ecart: number) {
  if (ecart < -0.2) {
    return 0;
  }
  if (ecart < -0.05) {
    return 1;
  }
  if (ecart < 0.05) {
    return 2;
  }
  return ecart < 0.2 ? 3 : 4;
}

function formatParcelleId(id: string) {
  const prefixe = id.slice(5, 8);
  const section = id.slice(8, 10).replace(/^0/, "");
  const numero = Number(id.slice(10));
  return `${prefixe === "000" ? "" : `${prefixe} `}${section} ${numero}`;
}

function EcartBadge({
  references,
  vente,
}: {
  references: IDVFReferencePrices | null;
  vente: IDVFVente;
}) {
  const ecart = getEcartReference(vente, references);
  if (ecart === null) {
    return null;
  }
  const { color } = dvfEcartClasses[getEcartClassIndex(ecart)];
  return (
    <span
      className={styles.ecartBadge}
      title="Écart au prix médian au m² de la commune sur les 12 derniers mois"
    >
      <span
        aria-hidden="true"
        className={styles.swatch}
        style={{ backgroundColor: color }}
      />
      {formatDVFPriceEvolution(Number((ecart * 100).toFixed(1)))} vs médiane
      communale
    </span>
  );
}

function VenteCard({
  parcelleId,
  references,
  vente,
}: {
  parcelleId: string;
  references: IDVFReferencePrices | null;
  vente: IDVFVente;
}) {
  const locaux = formatLocaux(vente.locaux);
  const terrain = vente.terrains.reduce((sum, { surface }) => sum + surface, 0);
  const autresParcelles = vente.parcelles.filter((id) => id !== parcelleId);

  return (
    <li className={styles.venteCard}>
      <div className={styles.venteHeader}>
        <span className={styles.venteCategorie}>
          <span
            aria-hidden="true"
            className={styles.swatch}
            style={{ backgroundColor: categorieColors[vente.categorie] }}
          />
          {categorieLabels[vente.categorie]}
        </span>
        <time dateTime={vente.date}>{formatDate(vente.date)}</time>
      </div>
      <p className={styles.ventePrix}>
        <strong>
          {vente.valeurFonciere === null
            ? "Valeur non renseignée"
            : euroFormatter.format(vente.valeurFonciere)}
        </strong>
        {vente.prixM2 !== null && (
          <span>
            {formatDVFPrice(vente.prixM2)}
            {vente.venteEnBloc && " (vente en bloc)"}
          </span>
        )}
      </p>
      <EcartBadge references={references} vente={vente} />
      <ul className={styles.venteDetails}>
        {locaux.map((local, index) => (
          <li key={index}>{local}</li>
        ))}
        {terrain > 0 && <li>Terrain · {formatSurface(terrain)}</li>}
        {vente.adresse && <li>{vente.adresse}</li>}
        {vente.natureMutation !== "Vente" && <li>{vente.natureMutation}</li>}
        {autresParcelles.length > 0 && (
          <li>
            Vente portant aussi sur{" "}
            {autresParcelles.length === 1
              ? "la parcelle"
              : `${autresParcelles.length} parcelles :`}{" "}
            {autresParcelles.map(formatParcelleId).join(", ")}
          </li>
        )}
      </ul>
    </li>
  );
}

function SectionSummary({
  references,
  sectionVentes,
  section,
}: {
  references: IDVFReferencePrices | null;
  section: string;
  sectionVentes: IDVFVente[];
}) {
  const rows = useMemo(
    () =>
      (["maison", "appartement"] as const).map((categorie) => {
        const prices = sectionVentes
          .filter((vente) => vente.comparable && vente.categorie === categorie)
          .map(({ prixM2 }) => prixM2 as number);
        return {
          categorie,
          count: prices.length,
          median: median(prices),
          reference: references?.[categorie] ?? null,
        };
      }),
    [references, sectionVentes]
  );
  const dates = sectionVentes.map(({ date }) => date).sort();

  return (
    <div className={styles.sectionSummary}>
      <h4 className="fr-text--md fr-mb-1w">
        Section {section.slice(3).replace(/^0/, "")}
      </h4>
      <p className="fr-text--sm fr-mb-1w">
        {formatNumber(sectionVentes.length)} vente
        {sectionVentes.length > 1 ? "s" : ""}
        {dates.length > 0 &&
          ` entre ${formatDate(dates[0])} et ${formatDate(dates.at(-1) ?? dates[0])}`}
        .
      </p>
      <dl className={styles.sectionStats}>
        {rows
          .filter(({ count }) => count > 0)
          .map(({ categorie, count, median: value, reference }) => (
            <div key={categorie}>
              <dt>
                {categorie === "maison" ? "Maisons" : "Appartements"} ({count})
              </dt>
              <dd>
                {formatDVFPrice(value)}
                {value !== null && reference !== null && (
                  <span className={styles.sectionReference}>
                    commune : {formatDVFPrice(reference)}
                  </span>
                )}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

function PanelContent({
  references,
  selection,
  typeFilter,
}: {
  references: IDVFReferencePrices | null;
  selection: Exclude<DVFParcelleSelection, { state: "idle" }>;
  typeFilter: DVFTypeFilter;
}) {
  if (selection.state === "loading") {
    return (
      <p className={`${styles.stateMessage} fr-mb-0`}>
        Chargement des ventes de la parcelle…
      </p>
    );
  }
  if (selection.state === "error") {
    return (
      <p className={`${styles.stateMessage} fr-mb-0`} role="alert">
        Impossible de récupérer les ventes de cette parcelle.
      </p>
    );
  }

  const { parcelle, sectionVentes } = selection;
  const ventes = filterVentes(selection.ventes, typeFilter);
  const hiddenCount = selection.ventes.length - ventes.length;
  return (
    <>
      {hiddenCount > 0 && (
        <p className={`${styles.stateMessage} fr-text--sm fr-mb-1w`}>
          {hiddenCount} vente{hiddenCount > 1 ? "s" : ""} masquée
          {hiddenCount > 1 ? "s" : ""} par le filtre « Biens vendus ».
        </p>
      )}
      {ventes.length === 0 ? (
        <p className={`${styles.stateMessage} fr-mb-2w`}>
          {hiddenCount > 0
            ? "Aucune vente de ce type sur cette parcelle."
            : "Aucune vente n’a été retrouvée pour cette parcelle sur la période couverte par DVF."}
        </p>
      ) : (
        <>
          <p className="fr-text--sm fr-mb-1w">
            {ventes.length} vente{ventes.length > 1 ? "s" : ""} sur cette
            parcelle
          </p>
          <ul className={styles.venteList}>
            {ventes.map((vente) => (
              <VenteCard
                key={vente.id}
                parcelleId={parcelle.id}
                references={references}
                vente={vente}
              />
            ))}
          </ul>
        </>
      )}
      <SectionSummary
        references={references}
        section={parcelle.section}
        sectionVentes={sectionVentes}
      />
    </>
  );
}

export function DVFParcellePanel({
  onClose,
  references,
  selection,
  typeFilter,
}: {
  onClose: () => void;
  references: IDVFReferencePrices | null;
  selection: DVFParcelleSelection;
  typeFilter: DVFTypeFilter;
}) {
  if (selection.state === "idle") {
    return null;
  }
  const { parcelle } = selection;

  return (
    <aside
      aria-live="polite"
      className={styles.detailsPanel}
      id="dvf-parcelle-details"
    >
      <div className={styles.panelHeader}>
        <div>
          <p className={`${styles.eyebrow} fr-text--sm fr-mb-0`}>
            Parcelle sélectionnée
          </p>
          <h3 className="fr-h5 fr-my-0">{formatParcelleId(parcelle.id)}</h3>
          {parcelle.contenance !== null && (
            <p className="fr-text--xs fr-mb-0">
              Contenance cadastrale : {formatSurface(parcelle.contenance)}
            </p>
          )}
        </div>
        <button
          aria-controls="dvf-parcelle-details"
          aria-label="Fermer le panneau de la parcelle"
          className={`${styles.closeButton} fr-btn fr-btn--tertiary-no-outline`}
          onClick={onClose}
          title="Fermer le panneau de la parcelle"
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={styles.panelBody}>
        <PanelContent
          references={references}
          selection={selection}
          typeFilter={typeFilter}
        />
      </div>
    </aside>
  );
}
