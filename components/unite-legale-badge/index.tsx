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
} from '#models/core/types';

const UniteLegaleBadge: React.FC<{
  uniteLegale: IUniteLegale;
  small?: boolean;
  hiddenByDefault?: boolean;
}> = ({ uniteLegale, small = false, hiddenByDefault = false }) => {
  if (isAssociation(uniteLegale)) {
    return <AssociationBadge small={small} />;
  }
  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    return <EntrepriseIndividuelleBadge small={small} />;
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    // colter before administration as it is more restrictive yet some colter might also be administration
    return <CollectiviteTerritorialeBadge small={small} />;
  }

  if (isServicePublic(uniteLegale)) {
    return <ServicePublicBadge small={small} />;
  }

  if (hiddenByDefault) {
    return null;
  }
  // default case
  return <DefaultStructureBadge small={small} />;
};

export default UniteLegaleBadge;
