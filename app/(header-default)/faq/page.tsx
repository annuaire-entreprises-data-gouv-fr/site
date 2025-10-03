import TextWrapper from "#components-ui/text-wrapper";
import parseMarkdownSync from "#components/markdown/parse-markdown";
import StructuredDataFAQ from "#components/structured-data/faq";
import { allFaqArticles, allFaqArticlesByGroup } from "#models/article/faq";
import type { Metadata } from "next";

const config = [
  {
    title: "Informations générales",
    key: "default",
  },
  {
    title: "Fonctionnement du service",
    key: "fonctionnement",
  },
  {
    title: "Réutiliser les données",
    key: "data",
    additionnalLink: [
      {
        href: "/donnees/sources",
        label: "Quelle est la liste des données utilisées sur ce site ?",
      },
      {
        href: "/donnees/api-entreprises",
        label:
          "Quelle est la différence entre l’API Entreprise et l’API Recherche d’entreprises",
      },
    ],
  },
  {
    title: "Modifier ou supprimer des données",
    key: "modifier",
    additionnalLink: [
      {
        href: "/faq/modifier",
        label: "Comment modifier une information affichée sur ce site ?",
      },
    ],
  },
  {
    title: "Nous contacter",
    key: "contact",
    additionnalLink: [
      {
        href: "/faq/parcours",
        label: "Comment joindre une entreprise ?",
      },
      {
        href: "/faq/parcours",
        label: "Comment vous alerter d’une fraude ou tentative d’escroquerie ?",
      },
      {
        href: "/faq/parcours",
        label:
          "Vous n’avez pas trouvé la réponse à votre question ? Contactez-nous !",
      },
    ],
  },
];

export default function FAQPage() {
  const articlesByGroup = allFaqArticlesByGroup;
  const allArticles = allFaqArticles;

  return (
    <>
      <StructuredDataFAQ
        data={allArticles.map(({ title, body }) => [
          title,
          parseMarkdownSync(body).html,
        ])}
      />
      <TextWrapper>
        <h1>Réponses à vos questions (FAQ) :</h1>
        {config.map(({ title, key, additionnalLink }) => (
          <>
            <h2>{title}</h2>
            <ul>
              {(articlesByGroup[key] || []).map(({ slug, title }, index) => (
                <li key={slug + index}>
                  <a href={`/faq/${slug}`}>{title}</a>
                </li>
              ))}
              {(additionnalLink || []).map(({ href, label }, index) => (
                <li key={href + index}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </>
        ))}
      </TextWrapper>
    </>
  );
}

export const metadata: Metadata = {
  title: "FAQ de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/faq",
  },
  robots: "index, follow",
};
