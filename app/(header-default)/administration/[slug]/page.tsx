import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import AdministrationDescription from "#components/administrations/administration-description";
import { Link } from "#components/Link";
import TextWrapper from "#components-ui/text-wrapper";
import { administrationsMetaData } from "#models/administrations";
import type { EAdministration } from "#models/administrations/EAdministration";
import { getFaqArticlesByTag } from "#models/article/faq";
import type { AppRouterProps } from "#utils/server-side-helper/extract-params";

const cachedGetAdministrations = cache((slug: string) => {
  const slugs = slug.split("_");

  const administrations = Object.values(administrationsMetaData).filter(
    (admin) => slugs.indexOf(admin.slug) > -1
  );

  if (administrations.length === 0) {
    notFound();
  }

  return {
    title: administrations.map((a) => a.long).join(" et "),
    administrations,
    articles: getFaqArticlesByTag([...slugs, "all"]),
    path: slug,
  };
});

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const params = await props.params;
  const slug = params.slug as EAdministration;

  const { title } = cachedGetAdministrations(slug);

  return {
    title,
    robots: "noindex",
    alternates: {
      canonical:
        "https://annuaire-entreprises.data.gouv.fr/administration/slug",
    },
  };
};

export default async function AdministrationPage(props: AppRouterProps) {
  const params = await props.params;
  const slug = params.slug as EAdministration;

  const { administrations, articles } = cachedGetAdministrations(slug);

  return (
    <TextWrapper>
      <h1>D’où viennent les informations de cette section ?</h1>
      {administrations.map(({ slug }) => (
        <AdministrationDescription key={slug} slug={slug} />
      ))}
      {articles && (
        <>
          <h2>Vous avez une questions sur ces données ?</h2>
          <ul>
            {articles.map(({ slug, title }) => (
              <li key={slug}>
                <Link href={`/faq/${slug}`}>{title}</Link>
              </li>
            ))}
          </ul>
          <br />
          <div>
            Vous ne trouvez pas la réponse à votre question ?{" "}
            <Link href="/faq">→ voir toutes les questions fréquentes</Link>
          </div>
        </>
      )}
    </TextWrapper>
  );
}
