import type { IArticle } from "../type";

export type IFaqArticle = {
  administrations: string[];
} & IArticle;

export const loadAllFaqArticlesByGroup = () => {
  const articlesByGroup: { [key: string]: IFaqArticle[] } = {};

  allFaqArticles.forEach((article) => {
    articlesByGroup[article.group || "default"] = [
      ...(articlesByGroup[article.group || "default"] || []),
      article,
    ];
  });

  return articlesByGroup;
};

export const getFaqArticle = (slug: string) =>
  allFaqArticles.find((article) => article.slug === slug);

export const getFaqArticlesByTag = (tagList: string[]): IFaqArticle[] => {
  const filteredArticles = new Set<IFaqArticle>();
  allFaqArticles.forEach((article) => {
    tagList.forEach((tag) => {
      if (article.administrations.indexOf(tag) > -1) {
        filteredArticles.add(article);
      }
    });
  });

  return Array.from(filteredArticles);
};

export const allFaqArticles = [
  require("../../../data/faq/adresse-personnelle.yml") as IFaqArticle,
  require("../../../data/faq/association-introuvable.yml") as IFaqArticle,
  require("../../../data/faq/convention-collective.yml") as IFaqArticle,
  require("../../../data/faq/donnees-financieres.yml") as IFaqArticle,
  require("../../../data/faq/egapro-egalite-professionnelle-femme-homme.yml") as IFaqArticle,
  require("../../../data/faq/entrepreneur-spectacles-vivants.yml") as IFaqArticle,
  require("../../../data/faq/entreprise-introuvable.yml") as IFaqArticle,
  require("../../../data/faq/entreprise-non-diffusible.yml") as IFaqArticle,
  require("../../../data/faq/extrait-kbis.yml") as IFaqArticle,
  require("../../../data/faq/extraire-liste-entreprises.yml") as IFaqArticle,
  require("../../../data/faq/fiche-immatriculation-introuvable.yml") as IFaqArticle,
  require("../../../data/faq/fraudes-ecroqueries-annuaire-des-entreprises.yml") as IFaqArticle,
  require("../../../data/faq/frequence-mise-a-jour-donnees.yml") as IFaqArticle,
  require("../../../data/faq/justificatif-immatriculation-non-diffusible.yml") as IFaqArticle,
  require("../../../data/faq/modifier-adresse.yml") as IFaqArticle,
  require("../../../data/faq/pro-connect.yml") as IFaqArticle,
  require("../../../data/faq/professionnels-bio.yml") as IFaqArticle,
  require("../../../data/faq/qualiopi-organisme-formation.yml") as IFaqArticle,
  require("../../../data/faq/reconnu-garant-environnement.yml") as IFaqArticle,
  require("../../../data/faq/registre-des-beneficiaires-effectifs.yml") as IFaqArticle,
  require("../../../data/faq/rendre-mon-entreprise-non-diffusible.yml") as IFaqArticle,
  require("../../../data/faq/reutiliser-les-donnees.yml") as IFaqArticle,
  require("../../../data/faq/societe-a-mission.yml") as IFaqArticle,
  require("../../../data/faq/supprimer-donnees-personnelles-entreprise.yml") as IFaqArticle,
];

export const allFaqArticlesByGroup = loadAllFaqArticlesByGroup();
