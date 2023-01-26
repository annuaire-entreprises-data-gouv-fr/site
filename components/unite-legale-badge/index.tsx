import {
  communityFill,
  buildingFill,
  user,
  administrationFill,
  collectiviteFill,
} from '#components-ui/icon';
import { Badge } from '#components-ui/tag/badge';
import {
  isServicePublic,
  isAssociation,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';

export const AssociationBadge = ({
  small = false,
  isSelected = false,
  onClick = null,
}) => (
  <Badge
    small={small}
    onClick={onClick}
    icon={communityFill}
    isSelected={isSelected}
    label="Association"
    fontColor="#3d0d71"
    backgroundColor="#e5d2f9"
  />
);
export const EntrepriseIndividuelleBadge = ({
  small = false,
  isSelected = false,
  onClick = null,
}) => (
  <Badge
    icon={user}
    small={small}
    onClick={onClick}
    isSelected={isSelected}
    label="Entreprise individuelle"
    fontColor="#034e6e"
    backgroundColor="#95e3e8"
  />
);
export const CollectiviteTerritorialeBadge = ({
  small = false,
  isSelected = false,
  onClick = null,
}) => (
  <Badge
    icon={collectiviteFill}
    small={small}
    onClick={onClick}
    isSelected={isSelected}
    label="Collectivité territoriale"
    fontColor="#563003"
    backgroundColor="#ffe283"
  />
);
export const ServicePublicBadge = ({
  small = false,
  isSelected = false,
  onClick = null,
}) => (
  <Badge
    icon={administrationFill}
    small={small}
    onClick={onClick}
    isSelected={isSelected}
    label="Service public"
    fontColor="#563003"
    backgroundColor="#ffe283"
  />
);
export const DefaultBadge = ({
  label = 'Unité légale',
  small = false,
  isSelected = false,
  onClick = null,
}) => (
  <Badge
    icon={buildingFill}
    small={small}
    onClick={onClick}
    label={label}
    isSelected={isSelected}
    fontColor="#000091"
    backgroundColor="#e8edff"
  />
);

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
  return <DefaultBadge small={small} />;
};

export default UniteLegaleBadge;
