export interface ILandingPage {
  slug: string;
  title: string;
  footerLabel: string;
  published: boolean;
  isServicePublic: boolean;
  description: string;
  filter: {
    name: string;
    value: string;
  };
  seo: {
    title: string;
    description: string;
  };
  reassurance: { title: string; body: string }[];
  datasources: string[];
  body: string;
}

const loadAllLandingPages = () => {
  const landingPages = [
    require("../../data/landing-pages/associations.yml") as ILandingPage,
    require("../../data/landing-pages/collectivites-territoriales.yml") as ILandingPage,
    require("../../data/landing-pages/entrepreneur-spectacles-vivants.yml") as ILandingPage,
    require("../../data/landing-pages/entreprises-individuelles.yml") as ILandingPage,
    require("../../data/landing-pages/ess-economie-sociale-solidaire.yml") as ILandingPage,
    require("../../data/landing-pages/organisme-formation-qualiopi.yml") as ILandingPage,
    require("../../data/landing-pages/rge.yml") as ILandingPage,
  ];

  return landingPages.filter((page) => page.published || false);
};

export const getAllLandingPages = () => allLandingPages;

export const getLandingPage = (slug: string) =>
  allLandingPages.find((landingPage) => landingPage.slug === slug);

const allLandingPages = loadAllLandingPages();
