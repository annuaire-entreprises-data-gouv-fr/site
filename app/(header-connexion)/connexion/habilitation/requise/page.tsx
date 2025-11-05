import type { Metadata } from "next";
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
        administration au sens de l’article L. 100-3 du code des relations entre
        le public et l’administration (CRPA).
      </div>
      <p>
        L'organisation à laquelle vous appartenez (
        <a href={`/entreprise/${searchParams.siren}`}>
          {searchParams.name || searchParams.siren}
        </a>
        ) <strong>ne fait pas partie</strong> de la{" "}
        <a href="https://www.data.gouv.fr/fr/datasets/liste-des-administrations-francaises/">
          liste des administrations
        </a>{" "}
        <strong>au sens de l’article L. 100-3</strong>. Si vous appartenez bien
        à une administration L. 100-3, vous pouvez{" "}
        <a href="https://www.demarches-simplifiees.fr/commencer/demande-d-ajout-a-la-liste-des-administrations">
          faire une demande d’ajout
        </a>{" "}
        de votre organisation à la liste.
      </p>
      <p>
        Si votre demande est acceptée, vous obtiendrez automatiquement l’accès à
        l’espace agent.
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
