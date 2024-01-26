import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  ServicePublicBadge,
} from '#components-ui/badge/frequent';
import {
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/index';

const UniteLegaleBadge: React.FC<{
  uniteLegale: IUniteLegale;
  small?: boolean;
  defaultBadgeShouldBeHid?: boolean;
}> = ({ uniteLegale, small = false, defaultBadgeShouldBeHid = false }) => {
  const badges = [];
  if (isAssociation(uniteLegale)) {
    badges.push(<AssociationBadge small={small} />);
  }
  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    badges.push(<EntrepriseIndividuelleBadge small={small} />);
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    // colter before administration as it is more restrictive yet some colter might also be administration
    badges.push(<CollectiviteTerritorialeBadge small={small} />);
  }

  if (isServicePublic(uniteLegale)) {
    badges.push(<ServicePublicBadge small={small} />);
  }

  if (badges.length > 0) {
    return (
      <>
        {badges.map((badge) => (
          <>{badge}</>
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
