import getSession from "#utils/server-side-helper/app/get-session";
import type { Metadata } from "next";
import ParcoursQuestions from "./_components/parcours-questions";

export const metadata: Metadata = {
  title: "FAQ interactive de l’Annuaire des Entreprises",
  robots: "index, follow",
  alternates: {
    canonical: `https://annuaire-entreprises.data.gouv.fr/faq/parcours`,
  },
};

export default async function Parcours() {
  const session = await getSession();

  return (
    <>
      <h1>Nous écrire</h1>
      <strong>Vous êtes :</strong>
      <ParcoursQuestions session={session} />
      <div style={{ marginTop: "200px" }} />
    </>
  );
}
