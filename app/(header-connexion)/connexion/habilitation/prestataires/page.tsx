import { ConnexionSubLayout } from "#components-ui/connexion-layout";
import connexionRefusedPicture from "#components-ui/illustrations/connexion-failed";
import constants from "#models/constants";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vous n’êtes pas autorisé(e) à accéder à l’espace agent",
  robots: "noindex, nofollow",
};

export default function RequiredHabilitationPage() {
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
      <div>
        Les prestataires ne sont pas autorisés à accéder à l’espace agent
        public.
      </div>
      <p>
        Si vous n’êtes pas prestataire vous pouvez{" "}
        <a href={constants.links.parcours.contact}>nous contacter</a> pour que
        nous étudions votre situation.
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
