"use client";

import { useAction } from "next-safe-action/hooks";
import { useCallback, useId, useState } from "react";
import { getOrganizationsGroupsAction } from "server-actions/agent/group-management";
import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import type { IAgentsGroup } from "#models/authentication/group";
import constants from "#models/constants";
import { NoGroupsModal } from "./no-groups-modal";
import styles from "./styles.module.css";

interface ICardHabilitationProps {
  groups: IAgentsGroup[];
}

const habilitationUrl = `${process.env.DATAPASS_URL}/demandes/annuaire-des-entreprises/nouveau`;

export const CardHabilitation = ({ groups }: ICardHabilitationProps) => {
  const labelId = useId();
  const [isNoGroupsModalOpen, setIsNoGroupsModalOpen] = useState(false);
  const [isActiveGroupsModalOpen, setIsActiveGroupsModalOpen] = useState(false);
  const [isOrganisationGroupsModalOpen, setIsOrganisationGroupsModalOpen] =
    useState(false);

  const {
    executeAsync: getOrganisationGroups,
    result: { data },
  } = useAction(getOrganizationsGroupsAction);

  const onHabilitationClick = useCallback(async () => {
    if (groups.length === 0) {
      const organisationGroups = data ?? (await getOrganisationGroups()).data;

      if (organisationGroups?.length) {
        setIsOrganisationGroupsModalOpen(true);
      } else {
        setIsNoGroupsModalOpen(true);
      }
    } else {
      setIsActiveGroupsModalOpen(true);
    }
  }, [data, getOrganisationGroups, groups]);

  const openNewHabilitation = useCallback(() => {
    window.open(habilitationUrl, "_blank");
  }, []);

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
        isVisible={isNoGroupsModalOpen}
        onCancel={() => setIsNoGroupsModalOpen(false)}
        onConfirm={openNewHabilitation}
      />
    </article>
  );
};
