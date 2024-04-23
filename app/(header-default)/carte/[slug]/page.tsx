import { Metadata } from 'next';
import { Info } from '#components-ui/alerts';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import MapEtablissement from '#components/map/map-etablissement';
import { MapTitleEtablissement } from '#components/title-section/etablissement/map-title';
import { getEtablissementWithLatLongFromSlug } from '#models/core/etablissement';
import {
  estDiffusible,
  getAdresseEtablissement,
} from '#models/core/statut-diffusion';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug } = extractParamsAppRouter(props);

  return {
    title: `Voir le siret ${slug} sur la carte`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/carte/${slug}`,
    },
  };
};

const EtablissementMapPage = async (props: AppRouterProps) => {
  const { slug } = extractParamsAppRouter(props);
  const session = await getSession();
  const etablissement = await getEtablissementWithLatLongFromSlug(slug);

  return (
    <>
      <div className="fr-container">
        <br />
        <a href={`/entreprise/${etablissement.siren}`}>
          ⇠ Retourner à la fiche de la structure
        </a>
        <br />
        <br />
        <a href={`/etablissement/${etablissement.siret}`}>
          ⇠ Retourner à la fiche de l’établissement
        </a>
        <HiddenH1 title="Localisation de l’etablissement" />
        <>
          <MapTitleEtablissement
            etablissement={etablissement}
            title={`Géolocalisation de l’établissement - ${getAdresseEtablissement(
              etablissement,
              session
            )}`}
          />
          {!estDiffusible(etablissement) ? (
            <Info>
              Cette structure est non-diffusible. <br />
              Son adresse complète n’est pas publique, mais sa commune de
              domiciliation est :{' '}
              {getAdresseEtablissement(etablissement, session)}.
            </Info>
          ) : (
            <MapEtablissement etablissement={etablissement} />
          )}
        </>
      </div>
    </>
  );
};

export default EtablissementMapPage;
