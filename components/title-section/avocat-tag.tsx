import { Tag } from "#components-ui/tag";
import type { IUniteLegale } from "#models/core/types";

export const AvocatTag = ({ uniteLegale }: { uniteLegale: IUniteLegale }) =>
  uniteLegale.complements.estAvocat ? (
    <a href="#avocats">
      <Tag color="new" size="medium">
        Avocat
      </Tag>
    </a>
  ) : null;
