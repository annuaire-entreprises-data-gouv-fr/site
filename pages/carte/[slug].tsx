import { GetServerSideProps } from 'next';
import React from 'react';
import Info from '#components-ui/alerts/info';
import { Icon } from '#components-ui/icon/wrapper';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import MapEtablissement from '#components/map/map-etablissement';
import Meta from '#components/meta';
import { MapTitleEtablissement } from '#components/title-etablissement-section';
import { getEtablissementWithLatLongFromSlug } from '#models/etablissement';
import { IEtablissement } from '#models/index';
import {
  estDiffusible,
  getAdresseEtablissement,
} from '#models/statut-diffusion';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  etablissement: IEtablissement;
}

const EtablissementMapPage: NextPageWithLayout<IProps> = ({
  etablissement,
  metadata: { session },
}) => (
  <>
    <Meta
      noIndex={true}
      title="Carte"
      canonical={`https://annuaire-entreprises.data.gouv.fr/carte/${etablissement.siret}`}
    />
    <div className="fr-container">
      <br />
      <a href={`/entreprise/${etablissement.siren}`}>← Retour</a>
      <HiddenH1 title="Localisation de l’etablissement" />
      <>
        <MapTitleEtablissement
          etablissement={etablissement}
          title="Géolocalisation de l’établissement"
        />
        {!estDiffusible(etablissement) && (
          <Info>
            Cette structure est non-diffusible. <br />
            Son adresse complète n’est pas publique, mais sa commune de
            domiciliation est :{' '}
            {getAdresseEtablissement(etablissement, session)}.
            <br />
            Le curseur ci-dessous <b>n’est pas placé</b> sur l’adresse réelle.
          </Info>
        )}
        <br />
        {etablissement.latitude && etablissement.longitude ? (
          <div className="map-container">
            <MapEtablissement etablissement={etablissement} />
          </div>
        ) : (
          <i>
            Nous n’avons pas réussi à déterminer la géolocalisation de cet
            établissement.
          </i>
        )}
        <br />
      </>
    </div>
    <style jsx>
      {`
        .map-container {
          display: flex;
          flex-direction: row-reverse;
          height: 600px;
        }
      `}
    </style>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const etablissement = await getEtablissementWithLatLongFromSlug(slug);

    return {
      props: {
        etablissement,
      },
    };
  }
);

export default EtablissementMapPage;
