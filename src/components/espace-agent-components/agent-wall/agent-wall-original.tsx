import { Link } from "#/components/link";
import ButtonProConnect from "#/components-ui/button-pro-connect";
import FloatingModal from "#/components-ui/floating-modal";
import style from "./style.module.css";

export const AgentWallOriginal: React.FC<{
  sectionId?: string;
  modalFooter?: React.JSX.Element | null;
}> = ({ sectionId, modalFooter = null }) => (
  <FloatingModal
    agentColor
    className={style["cta-actes"]}
    footer={modalFooter}
    noMobile
  >
    <h3>Vous êtes agent public ?</h3>
    <p>
      Accédez immédiatement à ces données sur{" "}
      <Link to="/lp/agent-public">l'espace agent public</Link>. En vous
      connectant vous acceptez nos{" "}
      <a
        href="/modalites-utilisation"
        rel="noreferrer noopener"
        target="_blank"
      >
        modalités d'utilisation
      </a>
      .
    </p>
    <ButtonProConnect event="AGENT_WALL" hash={sectionId} noFootLink />
    <Link to="/lp/agent-public">⇢ Découvrir l'espace agent public</Link>
  </FloatingModal>
);
