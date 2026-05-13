interface OGImage {
  alt: string;
  height: number;
  url: string;
  width: number;
}

interface Metadata {
  alternates?: {
    canonical?: string;
  };
  description?: string;
  formatDetection?: {
    telephone?: boolean;
  };
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    locale?: string;
    images?: OGImage[];
    siteName?: string;
    url?: string;
  };
  robots?: {
    follow?: boolean;
    index?: boolean;
  };
  title?: string;
}

export const SITE_NAME =
  "L’Annuaire des Entreprises : le moteur de recherche officiel";
export const SITE_DESCRIPTION =
  "L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…";

export const SHOULD_NOT_INDEX = process.env.INDEXING_ENABLED !== "enabled";
export const OPENGRAPH_IMAGES = [
  {
    url: "https://annuaire-entreprises.data.gouv.fr/images/linkedin.jpg",
    width: 1200,
    height: 627,
    alt: "annuaire-entreprises.data.gouv.fr",
  },
];

export function meta(
  obj: Metadata
): React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>[] {
  obj.title ??= SITE_NAME;
  obj.description ??= SITE_DESCRIPTION;
  obj.openGraph ??= {};
  obj.openGraph.title ??= obj.title;
  obj.openGraph.description ??= obj.description ?? SITE_DESCRIPTION;
  obj.openGraph.type ??= "website";
  obj.openGraph.locale ??= "fr_FR";
  obj.openGraph.images ??= OPENGRAPH_IMAGES;
  obj.openGraph.siteName = SITE_NAME;

  obj.formatDetection = { telephone: false };

  if (typeof obj.alternates?.canonical === "string") {
    obj.openGraph.url ??= obj.alternates.canonical;
  }

  obj.robots ??= { follow: true, index: true };

  return [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: obj.title,
    },
    {
      name: "description",
      content: obj.description,
    },
    {
      name: "robots",
      content: `${obj.robots?.index ? "index" : "noindex"}, ${obj.robots?.follow ? "follow" : "nofollow"}`,
    },
    {
      name: "og:title",
      content: obj.openGraph?.title,
    },
    {
      name: "og:description",
      content: obj.openGraph?.description,
    },
    {
      name: "og:type",
      content: obj.openGraph?.type ?? "website",
    },
    {
      name: "og:locale",
      content: obj.openGraph?.locale ?? "fr_FR",
    },
    {
      name: "og:site_name",
      content: obj.openGraph?.siteName ?? SITE_NAME,
    },
    {
      name: "og:image",
      content: obj.openGraph?.images?.[0]?.url ?? "",
    },
    {
      name: "og:image:width",
      content: obj.openGraph?.images?.[0]?.width.toString() ?? "",
    },
    {
      name: "og:image:height",
      content: obj.openGraph?.images?.[0]?.height.toString() ?? "",
    },
    {
      name: "og:image:alt",
      content: obj.openGraph?.images?.[0]?.alt ?? "",
    },
    {
      name: "og:image:type",
      content: "image/jpeg",
    },
  ];
}
