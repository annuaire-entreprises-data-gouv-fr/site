import { GetServerSideProps } from 'next';
import React from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import MapEtablissement from '#components/map/map-etablissement';
import { MapTitleEtablissement } from '#components/title-etablissement-section';
import { getEtablissementWithLatLongFromSlug } from '#models/etablissement';
import { IEtablissement } from '#models/index';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  etablissement: IEtablissement;
}

const EtablissementMapPage: React.FC<IProps> = ({
  etablissement,
  metadata,
}) => (
  <Page
    small={true}
    map={true}
    noIndex={true}
    title="Carte"
    canonical={`https://annuaire-entreprises.data.gouv.fr/carte/${etablissement.siret}`}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="fr-container">
      <br />
      <a href={`/entreprise/${etablissement.siren}`}>← Retour</a>
      <HiddenH1 title="Localisation de l’etablissement" />
      <>
        <MapTitleEtablissement
          etablissement={etablissement}
          title="Géolocalisation de l’établissement"
        />
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
  </Page>
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
