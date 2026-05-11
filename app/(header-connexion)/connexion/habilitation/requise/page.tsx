import type { Metadata } from "next";
import { Link } from "#components/Link";
import { ConnexionSubLayout } from "#components-ui/connexion-layout";
import connexionRefusedPicture from "#components-ui/illustrations/connexion-failed";
import type { AppRouterProps } from "#utils/server-side-helper/extract-params";
export const metadata: Metadata = {
  title: "Vous n’êtes pas autorisé(e) à accéder à l’espace agent",
  robots: "noindex, nofollow",
};

export default async function RequiredHabilitationPage(props: AppRouterProps) {
  const searchParams = await props.searchParams;
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
      <div>
        Seuls peuvent accéder à l’espace agent public les membres d’une
        administration autorisée.
      </div>
      <p>
        L'organisation à laquelle vous appartenez (
        <Link href={`/entreprise/${searchParams.siren}`}>
          {searchParams.name || searchParams.siren}
        </Link>
        ) <strong>ne fait pas partie</strong> de la{" "}
        <a href="https://www.data.gouv.fr/fr/datasets/liste-des-administrations-francaises/">
          liste des administrations autorisées
        </a>
        . Si vous pensez que votre organisation est bien autorisée, vous pouvez{" "}
        <a href="https://demarche.numerique.gouv.fr/commencer/demande-d-ajout-a-la-liste-des-administrations">
          faire une demande d’ajout
        </a>{" "}
        de votre organisation à la liste.
      </p>
      <p>
        Si votre demande est acceptée, vous obtiendrez automatiquement l’accès à
        l’espace agent.
      </p>
      <Link href="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
