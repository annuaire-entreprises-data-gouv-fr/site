import type { PropsWithChildren } from "react";
import constants from "#models/constants";
import { Badge, type IPartialBadgeProps } from ".";

export const LabelAndCertificateBadge = ({
  small = false,
  isSelected = false,
  onClick,
  label,
  link,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#ddd"
    fontColor={constants.colors.frBlue}
    icon="awardFill"
    isSelected={isSelected}
    label={label}
    link={link}
    onClick={onClick}
    small={small}
  />
);

export const AssociationBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e5d2f9"
    fontColor="#3d0d71"
    icon="communityFill"
    isSelected={isSelected}
    label="Association"
    onClick={onClick}
    small={small}
  />
);
export const FondationBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e5d2f9"
    fontColor="#3d0d71"
    icon="awardFill"
    isSelected={isSelected}
    label="Fondation"
    onClick={onClick}
    small={small}
  />
);
export const FondationFDDBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e5d2f9"
    fontColor="#3d0d71"
    icon="awardFill"
    isSelected={isSelected}
    label="Fond de dotation"
    onClick={onClick}
    small={small}
  />
);
export const FondationFEBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e5d2f9"
    fontColor="#3d0d71"
    icon="awardFill"
    isSelected={isSelected}
    label="Fond d'entreprise"
    onClick={onClick}
    small={small}
  />
);
export const FondationFRUPBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e5d2f9"
    fontColor="#3d0d71"
    icon="awardFill"
    isSelected={isSelected}
    label="Fondation reconnue d'utilité publique"
    onClick={onClick}
    small={small}
  />
);
export const EntrepriseIndividuelleBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#95e3e8"
    fontColor="#034e6e"
    icon="user"
    isSelected={isSelected}
    label="Entreprise individuelle"
    onClick={onClick}
    small={small}
  />
);
export const CollectiviteTerritorialeBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#ffe283"
    fontColor="#563003"
    icon="collectiviteFill"
    isSelected={isSelected}
    label="Collectivité territoriale"
    onClick={onClick}
    small={small}
  />
);
export const ServicePublicBadge = ({
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#ffe283"
    fontColor="#563003"
    icon="administrationFill"
    isSelected={isSelected}
    label="Administration"
    onClick={onClick}
    small={small}
  />
);
export const DefaultStructureBadge = ({
  label = "Unité légale",
  small = false,
  isSelected = false,
  onClick,
}: IPartialBadgeProps) => (
  <Badge
    backgroundColor="#e8edff"
    fontColor={constants.colors.frBlue}
    icon="buildingFill"
    isSelected={isSelected}
    label={label}
    onClick={onClick}
    small={small}
  />
);

export const OpenClosedTag: React.FC<
  PropsWithChildren<{ icon: "open" | "closed" | "questionFill"; label: string }>
> = ({ label = "", icon, children }) => (
  <div className="layout-left">
    <Badge backgroundColor="#ddd" fontColor="#666" icon={icon} label={label} />
    {children}
  </div>
);
