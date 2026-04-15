import { Fragment } from "react";
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  FondationBadge,
  FondationFDDBadge,
  FondationFEBadge,
  FondationFRUPBadge,
  ServicePublicBadge,
} from "#components-ui/badge/frequent";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isFondation,
  isFondationFDD,
  isFondationFE,
  isFondationFRUP,
  isServicePublic,
} from "#models/core/types";

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
  if (isFondation(uniteLegale)) {
    if (isFondationFDD(uniteLegale)) {
      badges.push(<FondationFDDBadge small={small} />);
    } else if (isFondationFE(uniteLegale)) {
      badges.push(<FondationFEBadge small={small} />);
    } else if (isFondationFRUP(uniteLegale)) {
      badges.push(<FondationFRUPBadge small={small} />);
    } else {
      badges.push(<FondationBadge small={small} />);
    }
  }

  if (isServicePublic(uniteLegale)) {
    badges.push(<ServicePublicBadge small={small} />);
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    badges.push(<CollectiviteTerritorialeBadge small={small} />);
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
