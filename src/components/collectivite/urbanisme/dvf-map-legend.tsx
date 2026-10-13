import type { ExpressionSpecification } from "maplibre-gl";
import type { IDVFReferencePrices } from "#/models/collectivite/dvf-mutations";
import constants from "#/models/constants";
import { formatDVFPrice } from "./chart-data";
import styles from "./dvf-map.module.css";

export type DVFTypeFilter = "tous" | "maison" | "appartement" | "local";
export type DVFColorMode = "type" | "prix";

export const dvfTypeFilters: { label: string; value: DVFTypeFilter }[] = [
  { value: "tous", label: "Tous les biens" },
  { value: "maison", label: "Maisons" },
  { value: "appartement", label: "Appartements" },
  { value: "local", label: "Locaux" },
];

export const dvfCategorieColors = {
  maison: constants.colors.frBlue,
  appartement: constants.chartColors[4],
  local: constants.chartColors[5],
  mixte: constants.chartColors[8],
  autre: "#929292",
} as const;

const typeLegend = [
  { color: dvfCategorieColors.maison, label: "Maison" },
  { color: dvfCategorieColors.appartement, label: "Appartement" },
  { color: dvfCategorieColors.local, label: "Local industriel ou commercial" },
  { color: dvfCategorieColors.mixte, label: "Plusieurs types de biens" },
  { color: dvfCategorieColors.autre, label: "Dépendance ou terrain seul" },
];

/** Classes d'écart au prix médian de la commune (palette divergente RdYlBu) */
export const dvfEcartClasses = [
  { color: "#2c7bb6", label: "Plus de 20 % en dessous" },
  { color: "#abd9e9", label: "5 à 20 % en dessous" },
  { color: "#ffffbf", label: "Dans la médiane (± 5 %)" },
  { color: "#fdae61", label: "5 à 20 % au-dessus" },
  { color: "#d7191c", label: "Plus de 20 % au-dessus" },
] as const;

const dvfPriceUnknownColor = "#d0d0d0";

const isTrue = (property: string): ExpressionSpecification => [
  "==",
  ["get", property],
  "t",
];

const typeFillColor: ExpressionSpecification = [
  "case",
  [
    ">",
    [
      "+",
      ["case", isTrue("vente_maison"), 1, 0],
      ["case", isTrue("vente_appartement"), 1, 0],
      ["case", isTrue("vente_local"), 1, 0],
    ],
    1,
  ],
  dvfCategorieColors.mixte,
  isTrue("vente_maison"),
  dvfCategorieColors.maison,
  isTrue("vente_appartement"),
  dvfCategorieColors.appartement,
  isTrue("vente_local"),
  dvfCategorieColors.local,
  dvfCategorieColors.autre,
];

const priceFillColor: ExpressionSpecification = [
  "case",
  ["==", ["typeof", ["feature-state", "ecart"]], "number"],
  [
    "step",
    ["to-number", ["feature-state", "ecart"]],
    dvfEcartClasses[0].color,
    -0.2,
    dvfEcartClasses[1].color,
    -0.05,
    dvfEcartClasses[2].color,
    0.05,
    dvfEcartClasses[3].color,
    0.2,
    dvfEcartClasses[4].color,
  ],
  dvfPriceUnknownColor,
];

export const dvfColorModeFillColors: Record<
  DVFColorMode,
  ExpressionSpecification
> = {
  type: typeFillColor,
  prix: priceFillColor,
};

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li>
      <span
        aria-hidden="true"
        className={styles.swatch}
        style={{ backgroundColor: color }}
      />
      {label}
    </li>
  );
}

const referenceLabels = [
  { key: "maison", label: "maisons" },
  { key: "appartement", label: "appartements" },
  { key: "local", label: "locaux" },
] as const;

export function DVFMapLegend({
  colorMode,
  references,
}: {
  colorMode: DVFColorMode;
  references: IDVFReferencePrices | null;
}) {
  if (colorMode === "type") {
    return (
      <div className={styles.legend}>
        <p className={styles.legendTitle}>
          Parcelles ayant fait l’objet d’une vente
        </p>
        <ul className={styles.legendList}>
          {typeLegend.map((item) => (
            <LegendItem key={item.label} {...item} />
          ))}
        </ul>
      </div>
    );
  }

  const availableReferences = referenceLabels.filter(
    ({ key }) => references?.[key]
  );

  return (
    <div className={styles.legend}>
      <p className={styles.legendTitle}>
        Prix au m² comparé à la médiane communale
      </p>
      <ul className={styles.legendList}>
        {dvfEcartClasses.map((item) => (
          <LegendItem key={item.label} {...item} />
        ))}
        <LegendItem
          color={dvfPriceUnknownColor}
          label="Prix au m² non calculable"
        />
      </ul>
      {availableReferences.length > 0 && (
        <p className={styles.legendNote}>
          Références :{" "}
          {availableReferences
            .map(
              ({ key, label }) =>
                `${formatDVFPrice(references?.[key] ?? null)} pour les ${label}`
            )
            .join(", ")}
          .
        </p>
      )}
    </div>
  );
}
