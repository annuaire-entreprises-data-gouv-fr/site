import { INSEE } from "#components/administrations";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { ISTATUTDIFFUSION, estDiffusible } from "#models/core/diffusion";
import { Info, ProtectedData } from "../alerts";

const DefaultNonDiffusibleAlert = () => (
  <Info full>
    Cette structure est non-diffusible. Cela signifie que certaines informations
    ne sont pas publiquement accessibles.
    <br />
    Si c’est votre entreprise et que vous souhaitez vous la rendre diffusible,{" "}
    <a href="https://statut-diffusion-sirene.insee.fr/">
      vous pouvez en faire la demande sur le site de l’Insee.
    </a>
    <br />
    <br />
    Si vous êtes <strong>agent public</strong>, vous pouvez consulter ces
    informations en vous connectant à{" "}
    <a href="/lp/agent-public">l’espace agent public</a>.
  </Info>
);

const ProtectedSirenAlert = () => (
  <Info full>
    Les dirigeant(e)s de cette structure se sont opposé(e)s à la diffusion de
    leurs informations personnelles.
    <br />
    En conséquence, certaines informations sont <strong>protégées</strong> et ne
    sont pas publiquement accessibles.
    <br />
    <br />
    Si vous êtes <strong>agent public</strong>, vous pouvez consulter ces
    informations en vous connectant à{" "}
    <a href="/lp/agent-public">l’espace agent public</a>.
  </Info>
);

export default function NonDiffusibleAlert({
  statutDiffusion,
  session,
}: {
  statutDiffusion: ISTATUTDIFFUSION;
  session: ISession | null;
}) {
  if (estDiffusible({ statutDiffusion })) {
    return null;
  }
  if (hasRights(session, ApplicationRights.nonDiffusible)) {
    if (statutDiffusion === ISTATUTDIFFUSION.NON_DIFF_STRICT) {
      return (
        <ProtectedData full>
          Pour des raisons que nous ignorons, l’
          <INSEE /> ne <strong>diffuse pas</strong> les informations de cette
          structure. Par conséquent, vous ne pouvez pas les consulter sur notre
          site, même avec votre compte <strong>agent public</strong>.
        </ProtectedData>
      );
    }
    return (
      <ProtectedData full>
        Les informations de cette structure ne sont pas accessibles au grand
        public mais vous pouvez voir ses informations grâce à votre compte{" "}
        <strong>agent-public</strong>.
      </ProtectedData>
    );
  }

  if (statutDiffusion === ISTATUTDIFFUSION.PROTECTED) {
    return <ProtectedSirenAlert />;
  }
  return <DefaultNonDiffusibleAlert />;
}
