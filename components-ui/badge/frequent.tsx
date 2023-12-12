import { PropsWithChildren } from 'react';
import constants from '#models/constants';
import { Badge, IPartialBadgeProps } from '.';

export const LabelAndCertificateBadge = ({
  small = false,
  isSelected = false,
  onClick,
  label,
  link,
}: IPartialBadgeProps) => (
  <Badge
    label={label}
    icon="awardFill"
    onClick={onClick}
    isSelected={isSelected}
    small={small}
    link={link}
    fontColor={constants.colors.frBlue}
    backgroundColor="#ddd"
  />
);

export const AssociationBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    small={small}
    onClick={onClick}
    icon="communityFill"
    isSelected={isSelected}
    label="Association"
    fontColor="#3d0d71"
    backgroundColor="#e5d2f9"
  />
);
export const EntrepriseIndividuelleBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    icon="user"
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
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    icon="collectiviteFill"
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
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    icon="administrationFill"
    small={small}
    onClick={onClick}
    isSelected={isSelected}
    label="Service public"
    fontColor="#563003"
    backgroundColor="#ffe283"
  />
);
export const DefaultStructureBadge = ({
  label = 'Unité légale',
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    icon="buildingFill"
    small={small}
    onClick={onClick}
    label={label}
    isSelected={isSelected}
    fontColor={constants.colors.frBlue}
    backgroundColor="#e8edff"
  />
);

export const OpenClosedTag: React.FC<
  PropsWithChildren<{ isVerified?: boolean; label: string }>
> = ({ label = '', isVerified = true }) => (
  <div className="layout-left">
    <Badge
      icon={isVerified ? 'open' : 'closed'}
      label={label}
      backgroundColor="#ddd"
      fontColor="#555"
    />
  </div>
);
