import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import { RenderMarkdownServerOnly } from '#components/markdown';
import { allDefinitions, getDefinition } from '#models/article/definitions';
import { Exception } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';
import {
  AppRouterProps,
  IParams,
} from '#utils/server-side-helper/app/extract-params';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, use } from 'react';

const cachedGetDefinition = cache((slug: string) => {
  const definition = getDefinition(slug);
  if (!definition || !definition.body || !definition.title) {
    // should not happen as we declared generateStaticParams
    logWarningInSentry(
      new Exception({
        name: 'DefinitionPageNotFound',
        context: { slug },
      })
    );
    notFound();
  }
  return definition;
});

export const generateMetadata = async ({
  params,
}: AppRouterProps): Promise<Metadata> => {
  const { slug } = await params;
  const definition = cachedGetDefinition(slug);

  return {
    title: definition.seo.title || definition.title,
    description: definition.seo.description,
    robots: 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/definitions/${definition.slug}`,
    },
  };
};

export default function DefinitionPage({ params }: AppRouterProps) {
  const { slug } = use(params);
  const definition = cachedGetDefinition(slug);

  return (
    <TextWrapper>
      <Breadcrumb
        links={[
          { href: '/definitions', label: 'Définitions' },
          { href: '', label: definition.title },
        ]}
      />
      <h1 className="definition-title">{definition.title}</h1>
      <RenderMarkdownServerOnly showToc>
        {definition.body}
      </RenderMarkdownServerOnly>

      {definition.cta ? (
        <div className="layout-left">
          <ButtonLink to={definition.cta.to}>{definition.cta.label}</ButtonLink>
        </div>
      ) : null}
      {definition.more ? (
        <div>
          <h2>Sur le même sujet</h2>
          <ul>
            {definition.more.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </TextWrapper>
  );
}

export async function generateStaticParams(): Promise<Array<IParams>> {
  return allDefinitions.map(({ slug }) => {
    return {
      slug,
    };
  });
}
