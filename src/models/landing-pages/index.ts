import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServerOnlyFn } from "@tanstack/react-start";
import { load } from "js-yaml";

export interface ILandingPage {
  body: string;
  datasources: string[];
  description: string;
  filter: {
    name: string;
    value: string;
  };
  footerLabel: string;
  isServicePublic: boolean;
  published: boolean;
  reassurance: { title: string; body: string }[];
  seo: {
    title: string;
    description: string;
  };
  slug: string;
  title: string;
}

const landingPagesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/landing-pages"
);

const loadAllLandingPages = createServerOnlyFn(() => {
  const landingPages = [] as ILandingPage[];

  const fileNames = readdirSync(landingPagesDir).filter((name) =>
    name.endsWith(".yml")
  );

  for (const fileName of fileNames) {
    const filePath = join(landingPagesDir, fileName);
    const raw = readFileSync(filePath, "utf8");
    const parsed = load(raw) as Omit<ILandingPage, "slug">;
    const slug = fileName.replace(/\.yml$/i, "");
    landingPages.push({ ...parsed, slug });
  }

  return landingPages.filter((page) => page.published);
});

export const getAllLandingPages = () => allLandingPages;

export const getLandingPage = (slug: string) =>
  allLandingPages.find((landingPage) => landingPage.slug === slug);

const allLandingPages = loadAllLandingPages();
