import { Tag } from "#components-ui/tag";
import { type IUniteLegale, isAvocat } from "#models/core/types";

export const AvocatTag = ({ uniteLegale }: { uniteLegale: IUniteLegale }) =>
  isAvocat(uniteLegale) ? (
    <Tag
      color="default"
      link={{
        href: `/entreprise/${uniteLegale.chemin}#avocats`,
        "aria-label": "Voir la section Avocats",
      }}
      size="medium"
    >
      Avocat
    </Tag>
  ) : null;
