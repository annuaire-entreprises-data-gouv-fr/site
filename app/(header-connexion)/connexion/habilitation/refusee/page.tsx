import type { Metadata } from "next";
import { Link } from "#components/Link";
import { ConnexionSubLayout } from "#components-ui/connexion-layout";
import connexionRefusedPicture from "#components-ui/illustrations/connexion-failed";
import type { AppRouterProps } from "#utils/server-side-helper/extract-params";

export const metadata: Metadata = {
  title: "Accès à l’espace agent refusé",
  robots: "noindex, nofollow",
};

export default async function RefusedConnexionPage(props: AppRouterProps) {
  const searchParams = await props.searchParams;
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>L’accès à l’espace agent vous est refusé</h1>
      <div>
        Seuls les membres d’une administration peuvent accéder à l’espace agent
        public.
      </div>
      <p>
        L'organisation à laquelle vous appartenez (
        <Link href={`/entreprise/${searchParams.siren}`}>
          {searchParams.name || searchParams.siren}
        </Link>
        ) n'est pas une administration et par conséquent, l'accès à l'espace
        agent vous est refusé.
      </p>
      <Link href="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
