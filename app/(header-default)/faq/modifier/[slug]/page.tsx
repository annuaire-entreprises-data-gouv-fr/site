import { Metadata } from 'next';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import {
  allDataToModify,
  getDataToModify,
} from '#models/administrations/data-to-modify';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import { redirectFAQPageNotFound } from '#utils/server-side-helper/app/redirect-faq-not-found';

type IParams = {
  slug: string;
};

export default async function FAQArticle(props: AppRouterProps) {
  const dataToModify = getDataToModify(props.params.slug);
  if (!dataToModify) {
    return redirectFAQPageNotFound(props.params.slug);
  }
  return (
    <>
      <TextWrapper>
        <Breadcrumb
          links={[
            { href: '/faq', label: 'Questions fréquentes' },
            { href: '/faq', label: 'Comment modifier ces informations' },

            { href: '', label: dataToModify.label },
          ]}
        />
        <h1>
          Comment modifier : “<strong>{dataToModify.label}</strong>” ?
        </h1>
        <p></p>
        <p>Ces informations proviennent de :</p>
        <ul>
          <li>
            Source de la donnée :{' '}
            <a href={dataToModify.datagouvLink}>{dataToModify.dataSource}</a>
          </li>
          <li>
            Service responsable :{' '}
            <a href={dataToModify.site}>{dataToModify.long}</a>.
          </li>
        </ul>
        {dataToModify.form ? (
          <>
            <p>Cette administration propose une démarche en ligne&nbsp;:</p>
            <ButtonLink to={dataToModify.form}>
              Accéder à la démarche en ligne
            </ButtonLink>
          </>
        ) : (
          <>
            <br />
            <ButtonLink to={dataToModify.contact}>
              Contacter le service ({dataToModify.short})
            </ButtonLink>
          </>
        )}

        <h2>Vous ne trouvez pas votre réponse ?</h2>
        <div className="layout-left">
          <ButtonLink to="/faq" alt small>
            Consultez notre FAQ
          </ButtonLink>
        </div>
      </TextWrapper>
    </>
  );
}

export async function generateStaticParams(): Promise<Array<IParams>> {
  return allDataToModify
    .filter(({ slug }) => !!slug)
    .map(({ slug }) => {
      return {
        slug,
      };
    });
}

export const generateMetadata = function (props: AppRouterProps): Metadata {
  const dataToModify = getDataToModify(props.params.slug);
  if (!dataToModify) {
    return redirectFAQPageNotFound(props.params.slug);
  }
  return {
    title: dataToModify.label,
    robots: 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/faq/modifier/${dataToModify.slug}`,
    },
  };
};
