import styles from "./styles.module.css";
import type {
  RnbBuildingAddress,
  RnbBuildingExternalId,
  RnbBuildingPlot,
  RnbBuildingSelection,
} from "./use-rnb-buildings";

const maxPanelItems = 5;

const rnbStatusLabels: Record<string, string> = {
  constructed: "Construit",
  demolished: "Démoli",
  notUsable: "Non utilisable",
};

function getDisplayText(value: unknown) {
  if (!(typeof value === "string" || typeof value === "number")) {
    return;
  }

  const text = `${value}`.trim();

  return text.length > 0 ? text : undefined;
}

function hasDisplayText(value?: string): value is string {
  return typeof value === "string" && value.length > 0;
}

function formatStatus(status?: string) {
  if (!status) {
    return;
  }

  return rnbStatusLabels[status] ?? status;
}

function formatActivity(isActive?: boolean) {
  if (typeof isActive !== "boolean") {
    return;
  }

  return isActive ? "Actif" : "Inactif";
}

function formatCoverRatio(ratio?: number | null) {
  if (typeof ratio !== "number") {
    return;
  }

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(ratio);
}

function addOverflowItem(values: string[], totalCount: number) {
  const remainingItemsCount = totalCount - values.length;

  if (remainingItemsCount <= 0) {
    return values;
  }

  return [
    ...values,
    `+ ${remainingItemsCount} autre${remainingItemsCount > 1 ? "s" : ""}`,
  ];
}

function formatAddress(address: RnbBuildingAddress) {
  const streetLine = [address.street_number, address.street_rep, address.street]
    .map(getDisplayText)
    .filter(hasDisplayText)
    .join(" ");
  const cityLine = [address.city_zipcode, address.city_name]
    .map(getDisplayText)
    .filter(hasDisplayText)
    .join(" ");

  return (
    [streetLine, cityLine].filter(hasDisplayText).join(", ") ||
    getDisplayText(address.id)
  );
}

function formatAddresses(addresses?: RnbBuildingAddress[]) {
  if (!addresses?.length) {
    return [];
  }

  const values = addresses
    .slice(0, maxPanelItems)
    .map(formatAddress)
    .filter(hasDisplayText);

  return addOverflowItem(values, addresses.length);
}

function formatPlot(plot: RnbBuildingPlot) {
  const plotId = getDisplayText(plot.id);
  const coverRatio = formatCoverRatio(plot.bdg_cover_ratio);

  if (plotId && coverRatio) {
    return `${plotId} (${coverRatio})`;
  }

  return plotId;
}

function formatPlots(plots?: RnbBuildingPlot[]) {
  if (!plots?.length) {
    return [];
  }

  const values = plots
    .slice(0, maxPanelItems)
    .map(formatPlot)
    .filter(hasDisplayText);

  return addOverflowItem(values, plots.length);
}

function formatExternalId(externalId: RnbBuildingExternalId) {
  const id = getDisplayText(externalId.id);
  const source = getDisplayText(externalId.source)?.toUpperCase();
  const sourceVersion = getDisplayText(externalId.source_version);
  const label = [source, sourceVersion].filter(hasDisplayText).join(" ");

  if (label && id) {
    return `${label} : ${id}`;
  }

  return id ?? label;
}

function formatExternalIds(externalIds?: RnbBuildingExternalId[]) {
  if (!externalIds?.length) {
    return [];
  }

  const values = externalIds
    .slice(0, maxPanelItems)
    .map(formatExternalId)
    .filter(hasDisplayText);

  return addOverflowItem(values, externalIds.length);
}

function DetailValue({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className={`${styles.detailBlock} fr-mb-2w`}>
      <dt className={`${styles.detailLabel} fr-text--bold fr-mb-0`}>{label}</dt>
      <dd className={`${styles.detailValue} fr-mb-0`}>{value}</dd>
    </div>
  );
}

function DetailList({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.detailBlock} fr-mb-2w`}>
      <dt className={`${styles.detailLabel} fr-text--bold fr-mb-1w`}>
        {label}
      </dt>
      <dd className="fr-mb-0">
        <ul className={`${styles.detailList} fr-m-0 fr-p-0`}>
          {values.map((value) => (
            <li className={styles.detailListItem} key={value}>
              {value}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function PanelContent({
  selection,
}: {
  selection: Exclude<RnbBuildingSelection, { state: "idle" }>;
}) {
  if (selection.state === "loading") {
    return (
      <p className={`${styles.stateMessage} fr-mb-0`}>
        Chargement des informations du bâtiment…
      </p>
    );
  }

  if (selection.state === "error") {
    return (
      <p className={`${styles.stateMessage} fr-mb-0`} role="alert">
        Impossible de récupérer les informations du bâtiment.
      </p>
    );
  }

  const { building } = selection;

  return (
    <dl className="fr-mb-0">
      <DetailValue label="Statut" value={formatStatus(building.status)} />
      <DetailValue
        label="État de l'identifiant"
        value={formatActivity(building.is_active)}
      />
      <DetailList
        label="Adresses"
        values={formatAddresses(building.addresses)}
      />
      <DetailList label="Parcelles" values={formatPlots(building.plots)} />
      <DetailList
        label="Identifiants externes"
        values={formatExternalIds(building.ext_ids)}
      />
    </dl>
  );
}

export function RnbBuildingDetailsPanel({
  onClose,
  selection,
}: {
  onClose: () => void;
  selection: RnbBuildingSelection;
}) {
  if (selection.state === "idle") {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      className={styles.detailsPanel}
      id="rnb-building-details"
    >
      <div
        className={`${styles.panelHeader} fr-grid-row fr-grid-row--middle fr-p-3w fr-pb-2w`}
      >
        <div className="fr-col">
          <p className={`${styles.eyebrow} fr-text--sm fr-mb-1w`}>
            Bâtiment sélectionné
          </p>
          <h3 className={`${styles.rnbId} fr-h5 fr-my-0`}>{selection.rnbId}</h3>
        </div>
        <div className="fr-col-auto">
          <button
            aria-controls="rnb-building-details"
            aria-label="Fermer le panneau du bâtiment"
            className={`${styles.closeButton} fr-btn fr-btn--tertiary-no-outline`}
            onClick={onClose}
            title="Fermer le panneau du bâtiment"
            type="button"
          >
            <span aria-hidden="true" className={styles.closeButtonSymbol}>
              ×
            </span>
          </button>
        </div>
      </div>
      <div className="fr-p-3w fr-pt-2w">
        <PanelContent selection={selection} />
      </div>
    </aside>
  );
}
