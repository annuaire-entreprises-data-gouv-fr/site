import { Metadata } from 'next';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import { RenderMarkdownServerOnly } from '#components/markdown';
import { allDefinitions, getDefinition } from '#models/article/definitions';
import { InternalError } from '#models/exceptions';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';

type IParams = {
  slug: string;
};

export const generateMetadata = withErrorHandler(function ({
  params,
}: {
  params: IParams;
}): Metadata {
  const definition = getDefinition(params.slug);
  if (!definition) {
    throw new InternalError({
      message: 'Definition not found',
      context: params,
    });
  }
  return {
    title: definition.seo.title || definition.title,
    description: definition.seo.description,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/definitions/${definition.slug}`,
    },
  };
});

export default withErrorHandler(function DefinitionPage({
  params,
}: {
  params: IParams;
}) {
  const definition = getDefinition(params.slug);
  if (!definition || !definition.body || !definition.title) {
    throw new InternalError({
      message: 'Definition not found',
      context: params,
    });
  }

  return (
    <>
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
            <ButtonLink to={definition.cta.to}>
              {definition.cta.label}
            </ButtonLink>
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
    </>
  );
});

export async function generateStaticParams(): Promise<Array<IParams>> {
  return allDefinitions.map(({ slug }) => {
    return {
      slug,
    };
  });
}
