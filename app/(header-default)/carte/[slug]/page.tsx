import { Info } from '#components-ui/alerts';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import MapEtablissement from '#components/map/map-etablissement';
import { MapTitleEtablissement } from '#components/title-section/etablissement/map-title';
import { estDiffusible } from '#models/core/diffusion';
import { getEtablissementWithLatLongFromSlug } from '#models/core/etablissement';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import { Metadata } from 'next';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug } = await extractParamsAppRouter(props);

  return {
    title: `Voir le siret ${slug} sur la carte`,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/carte/${slug}`,
    },
  };
};

const EtablissementMapPage = async (props: AppRouterProps) => {
  const { slug } = await extractParamsAppRouter(props);
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
            title={`Géolocalisation de l’établissement - ${etablissement.adresse}`}
          />
          {!estDiffusible(etablissement) ? (
            <Info>
              Cette structure est non-diffusible. <br />
              Son adresse complète n’est pas publique, mais sa commune de
              domiciliation est : {etablissement.adresse}.
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
