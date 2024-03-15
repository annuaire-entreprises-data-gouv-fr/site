import { Metadata } from 'next';
import { OPENGRAPH_IMAGES, SITE_DESCRIPTION, SITE_NAME } from '.';

export function meta(obj: Metadata): Metadata {
  obj.metadataBase = new URL('https://annuaire-entreprises.data.gouv.fr');
  obj.title ??= SITE_NAME;
  obj.description ??= SITE_DESCRIPTION;
  obj.openGraph ??= {};
  obj.openGraph.title ??= obj.title;
  obj.openGraph.description ??= obj.description ?? SITE_DESCRIPTION;
  // @ts-ignore
  obj.openGraph.type ??= 'website';
  obj.openGraph.images ??= OPENGRAPH_IMAGES;
  obj.openGraph.siteName = SITE_NAME;

  if (typeof obj.alternates?.canonical === 'string') {
    obj.openGraph.url ??= obj.alternates.canonical;
  }

  obj.robots ??= {};
  if (typeof obj.robots === 'object') {
    obj.robots.follow = true;
  }

  return obj;
}
