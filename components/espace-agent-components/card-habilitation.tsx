"use client";

import { useCallback, useId, useState } from "react";
import { getOrganizationsGroupsAction } from "server-actions/agent/group-management";
import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import type {
  IAgentsGroup,
  IAgentsOrganizationGroup,
} from "#models/authentication/group";
import constants from "#models/constants";
import { ActiveGroupsModal } from "./active-groups-modal";
import { NoGroupsModal } from "./no-groups-modal";
import { OrganisationGroupsModal } from "./organisation-groups-modal";
import styles from "./styles.module.css";

interface ICardHabilitationProps {
  habilitationUrl: string;
  groups: IAgentsGroup[];
}

export const CardHabilitation = ({
  habilitationUrl,
  groups,
}: ICardHabilitationProps) => {
  const labelId = useId();

  const [organisationGroups, setOrganisationGroups] = useState<
    IAgentsOrganizationGroup[] | null
  >(null);
  const [isLoadingOrganisationGroups, setIsLoadingOrganisationGroups] =
    useState(false);

  const [isNoGroupsModalOpen, setIsNoGroupsModalOpen] = useState(false);
  const [isActiveGroupsModalOpen, setIsActiveGroupsModalOpen] = useState(false);
  const [isOrganisationGroupsModalOpen, setIsOrganisationGroupsModalOpen] =
    useState(false);

  const getOrganisationGroups = useCallback(async () => {
    if (organisationGroups) {
      return organisationGroups;
    }

    setIsLoadingOrganisationGroups(true);

    try {
      const { data } = await getOrganizationsGroupsAction();
      const newOrganisationGroups = data
        ? data.filter((group) => !groups.some((g) => g.id === group.id))
        : [];

      setOrganisationGroups(newOrganisationGroups);
      setIsLoadingOrganisationGroups(false);

      return newOrganisationGroups;
    } catch {
      setOrganisationGroups(null);
      setIsLoadingOrganisationGroups(false);

      return [];
    }
  }, [groups, organisationGroups]);

  const openNewHabilitation = useCallback(() => {
    setIsActiveGroupsModalOpen(false);
    setIsOrganisationGroupsModalOpen(false);
    setIsNoGroupsModalOpen(false);

    window.open(habilitationUrl, "_blank");
  }, [habilitationUrl]);

  const onHabilitationClick = useCallback(async () => {
    if (groups.length === 0) {
      const orgGroups = await getOrganisationGroups();

      if (orgGroups.length) {
        setIsOrganisationGroupsModalOpen(true);
      } else {
        setIsNoGroupsModalOpen(true);
      }
    } else {
      setIsActiveGroupsModalOpen(true);
    }
  }, [getOrganisationGroups, groups]);

  const onConfirmActiveGroupsModal = useCallback(async () => {
    const orgGroups = await getOrganisationGroups();

    setIsActiveGroupsModalOpen(false);

    if (orgGroups.length) {
      setIsOrganisationGroupsModalOpen(true);
    } else {
      openNewHabilitation();
    }
  }, [getOrganisationGroups, openNewHabilitation]);

  return (
    <article aria-labelledby={labelId} className={styles.cardHabilitation}>
      <Tag color="agent">
        <Icon slug="infoFill">Habilitation</Icon>
      </Tag>
      <p className={styles.cardHabilitationTitle} id={labelId}>
        Accédez à des données supplémentaires sous habilitation !
      </p>
      <p className={styles.cardHabilitationDescription}>
        Votre mission concerne la fraude, les marchés publics, les subventions
        aux associations ou les aides publiques ?
      </p>
      <ul className="fr-btns-group">
        <li>
          <ButtonLink
            alt
            ariaLabel="Se renseigner sur l’habilitation"
            hideExternalIcon
            target="_blank"
            to={constants.links.documentation.habilitation}
          >
            <Icon slug="book2Fill">Se renseigner sur l’habilitation</Icon>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            ariaLabel="Demander une habilitation"
            onClick={onHabilitationClick}
          >
            <Icon slug="editBoxFill">Demander une habilitation</Icon>
          </ButtonLink>
        </li>
      </ul>
      <NoGroupsModal
        isLoading={isLoadingOrganisationGroups}
        isVisible={isNoGroupsModalOpen}
        onCancel={() => setIsNoGroupsModalOpen(false)}
        onConfirm={openNewHabilitation}
      />
      <ActiveGroupsModal
        groups={groups}
        isLoading={isLoadingOrganisationGroups}
        isVisible={isActiveGroupsModalOpen}
        onCancel={() => setIsActiveGroupsModalOpen(false)}
        onConfirm={onConfirmActiveGroupsModal}
      />
      <OrganisationGroupsModal
        groups={organisationGroups ?? []}
        isVisible={isOrganisationGroupsModalOpen}
        onCancel={() => setIsOrganisationGroupsModalOpen(false)}
        onConfirm={openNewHabilitation}
      />
    </article>
  );
};
