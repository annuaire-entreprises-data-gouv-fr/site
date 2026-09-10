import { Fragment } from "react";
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  FondationBadge,
  ServicePublicBadge,
} from "#/components-ui/badge/frequent";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isFondation,
  isServicePublic,
} from "#/models/core/types";

const UniteLegaleBadge: React.FC<{
  uniteLegale: IUniteLegale;
  small?: boolean;
  defaultBadgeShouldBeHid?: boolean;
}> = ({ uniteLegale, small = false, defaultBadgeShouldBeHid = false }) => {
  const badges: React.ReactNode[] = [];
  if (isAssociation(uniteLegale)) {
    badges.push(<AssociationBadge small={small} />);
  }
  if (isEntrepreneurIndividuel(uniteLegale)) {
    badges.push(<EntrepriseIndividuelleBadge small={small} />);
  }

  if (isServicePublic(uniteLegale)) {
    badges.push(<ServicePublicBadge small={small} />);
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    badges.push(<CollectiviteTerritorialeBadge small={small} />);
  }
  if (isFondation(uniteLegale)) {
    badges.push(<FondationBadge small={small} />);
  }

  if (badges.length > 0) {
    return (
      <>
        {badges.map((badge, i) => (
          <Fragment key={i}>{badge}</Fragment>
        ))}
      </>
    );
  }

  // default
  if (defaultBadgeShouldBeHid) {
    return null;
  }

  return <DefaultStructureBadge small={small} />;
};

export default UniteLegaleBadge;
