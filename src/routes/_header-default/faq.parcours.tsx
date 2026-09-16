import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import ParcoursQuestions, {
  type FAQQuestion,
  FAQQuestions,
  type FAQTarget,
  FAQTargets,
} from "#/components/screens/faq.parcours/parcours-questions";
import { useAuth } from "#/contexts/auth.context";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/faq/parcours")({
  validateSearch: z.object({
    userType: z
      .enum(Object.keys(FAQTargets) as [FAQTarget])
      .optional()
      .catch(undefined),
    questionType: z
      .enum(Object.keys(FAQQuestions) as [FAQQuestion])
      .optional()
      .catch(undefined),
  }),
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/faq/parcours";
    return {
      meta: meta({
        title: "FAQ interactive de l’Annuaire des Entreprises",
        robots: "index, follow",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { user } = useAuth();
  const { userType, questionType } = Route.useSearch();

  return (
    <>
      <h1>Nous écrire</h1>
      <strong>Vous êtes :</strong>
      <ParcoursQuestions
        initialQuestionType={questionType}
        initialUserType={userType}
        user={user}
      />
      <div style={{ marginTop: "200px" }} />
    </>
  );
}
