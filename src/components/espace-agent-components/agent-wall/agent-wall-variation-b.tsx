import { Link } from "#/components/link";
import ButtonProConnect from "#/components-ui/button-pro-connect";
import FloatingModal from "#/components-ui/floating-modal";
import { Icon } from "#/components-ui/icon/wrapper";
import style from "./style.module.css";

export const AgentWallVariationB: React.FC<{
  modalFooter?: React.JSX.Element | null;
}> = ({ modalFooter = null }) => (
  <FloatingModal
    className={`${style["agent-wall-card"]} ${style["agent-wall-variation-b"]}`}
    footer={modalFooter}
  >
    <h3 className={style["agent-wall-title-b"]}>
      Vous êtes agent public&nbsp;?
    </h3>
    <p className={style["agent-wall-text-b"]}>
      Connectez-vous pour afficher cette section.
    </p>
    <div className={style["agent-wall-proconnect"]}>
      <ButtonProConnect event="AGENT_WALL" noFootLink />
    </div>
    <Link
      className={`fr-btn fr-btn--secondary ${style["agent-wall-discover-b"]}`}
      to="/lp/agent-public"
    >
      Découvrir l’espace agent
    </Link>
    <Link
      className={style["agent-wall-terms-b"]}
      target="_blank"
      to="/modalites-utilisation"
    >
      <span>Lire les conditions d’utilisation</span>
      <Icon color="#3a3a3a" size={15} slug="externalLinkLine" />
    </Link>
  </FloatingModal>
);
