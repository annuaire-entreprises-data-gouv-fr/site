import { Tag } from "#/components-ui/tag";
import { type IUniteLegale, isAvocat } from "#/models/core/types";

export const AvocatTag = ({ uniteLegale }: { uniteLegale: IUniteLegale }) =>
  isAvocat(uniteLegale) ? (
    <Tag
      color="brownOpera"
      link={{
        to: "/entreprise/$slug",
        params: { slug: uniteLegale.chemin },
        hash: "avocats",
        "aria-label": "Voir la section Avocats",
      }}
      size="medium"
    >
      Avocat
    </Tag>
  ) : null;
