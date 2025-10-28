import type { Metadata } from "next";
import ButtonLink from "#components-ui/button";

export const metadata: Metadata = {
  title: "L’accès au site vous est refusé",
  robots: "noindex, nofollow",
};

const ForbiddenPage = () => (
  <>
    <h1>Accès refusé 🚫</h1>
    <p>
      Notre algorithme de détection pense que vous êtes un robot. <br />
      Par conséquent, l’accès à cette page vous est refusé.
    </p>
    <p>
      Vous pouvez continuer a naviguer sur le site. Si vous n’êtes pas un robot
      et que le problème se reproduit, vous pouvez nous contacter via notre FAQ.
    </p>
    <ul className="fr-btns-group fr-btns-group--inline-md">
      <li>
        <ButtonLink alt to="/faq">
          Accéder à la FAQ
        </ButtonLink>
      </li>
      <li>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </li>
    </ul>
  </>
);

export default ForbiddenPage;
