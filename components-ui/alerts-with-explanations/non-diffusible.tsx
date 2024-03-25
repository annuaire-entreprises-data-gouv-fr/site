import { ISTATUTDIFFUSION, estDiffusible } from '#models/core/statut-diffusion';
import { ISession } from '#models/user/session';
import { Info, ProtectedData } from '../alerts';

const DefaultNonDiffusibleAlert = () => (
  <Info full>
    Cette structure est non-diffusible. Cela signifie que certaines informations
    ne sont pas publiquement accessibles.
    <br />
    Si c’est votre entreprise et que vous souhaitez vous la rendre diffusible,{' '}
    <a href="https://statut-diffusion-sirene.insee.fr/">
      vous pouvez en faire la demande sur le site de l’Insee.
    </a>
    <br />
    <br />
    Si vous êtes <strong>agent public</strong>, vous pouvez consulter ces
    informations sur <a href="/lp/agent-public">l’espace agent public</a>.
  </Info>
);

const ProtectedSirenAlert = () => (
  <Info full>
    Les dirigeant(e)s de cette structure se sont opposé(e)s à la diffusion de
    leurs informations personnelles.
    <br />
    En conséquence, certaines informations{' '}
    <strong>ne sont pas publiquement accessibles</strong>.
    <br />
    <br />
    Si vous êtes <strong>agent public</strong>, vous pouvez consulter ces
    informations sur <a href="/lp/agent-public">l’espace agent public</a>.
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
  if (session?.rights.nonDiffusible) {
    <ProtectedData full>
      Les informations de cette structure ne sont pas accessibles au grand
      public mais vous pouvez voir ses informations grâce à votre compte{' '}
      <strong>agent-public</strong>.
    </ProtectedData>;
  }

  if (statutDiffusion === ISTATUTDIFFUSION.PROTECTED) {
    return <ProtectedSirenAlert />;
  }
  return <DefaultNonDiffusibleAlert />;
}
