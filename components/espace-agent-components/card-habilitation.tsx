import { useId } from "react";
import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import constants from "#models/constants";
import styles from "./styles.module.css";

export const CardHabilitation = () => {
  const labelId = useId();

  return (
    <article
      aria-labelledby={labelId}
      className={styles.cardHabilitation}
      hidden
    >
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
            hideExternalIcon
            target="_blank"
            to={`${process.env.DATAPASS_URL}/demandes/annuaire-des-entreprises/nouveau`}
          >
            <Icon slug="editBoxFill">Demander une habilitation</Icon>
          </ButtonLink>
        </li>
      </ul>
    </article>
  );
};
