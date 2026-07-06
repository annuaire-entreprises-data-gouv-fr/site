import clsx from "clsx";
import { Link } from "#/components/link";
import ButtonProConnect from "#/components-ui/button-pro-connect";
import FloatingModal from "#/components-ui/floating-modal";
import { Icon } from "#/components-ui/icon/wrapper";
import style from "./style.module.css";

export const AgentWallVariationA: React.FC<{
  sectionId?: string;
  modalFooter?: React.JSX.Element | null;
}> = ({ sectionId, modalFooter = null }) => (
  <FloatingModal
    className={clsx(style["agent-wall-card"], style["agent-wall-variation-a"])}
    footer={modalFooter}
  >
    <p className={style["agent-wall-kicker"]}>ACCÈS AGENT</p>
    <Icon
      className={style["agent-wall-lock"]}
      color="var(--annuaire-colors-frBlue)"
      size={49}
      slug="lockFill"
    />
    <h3 className={style["agent-wall-title-a"]}>
      Débloquer les sections
      <br />
      réservées aux agents
    </h3>
    <p className={style["agent-wall-text-a"]}>
      Identifiez-vous pour révéler le
      <br />
      contenu protégé.
    </p>
    <div className={style["agent-wall-proconnect"]}>
      <ButtonProConnect event="AGENT_WALL" hash={sectionId} noFootLink />
    </div>
    <Link className={style["agent-wall-discover-a"]} to="/lp/agent-public">
      <Icon
        color="var(--annuaire-colors-frBlue)"
        size={16}
        slug="flashlightFill"
      />
      <span>Découvrir l’espace agent</span>
    </Link>
    <Link
      className={style["agent-wall-terms-a"]}
      target="_blank"
      to="/modalites-utilisation"
    >
      <span>Lire les conditions d’utilisation</span>
      <Icon
        color="var(--annuaire-colors-frBlue)"
        size={15}
        slug="externalLinkLine"
      />
    </Link>
  </FloatingModal>
);
