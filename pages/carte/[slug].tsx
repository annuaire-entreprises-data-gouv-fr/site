import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement } from '../../models';
import MapEtablissement from '../../components/map/map-etablissement';
import { getEtablissementWithLatLongFromSlug } from '../../models/etablissement';
import { MapTitleEtablissement } from '../../components/title-etablissement-section';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

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
      <a href={`/entreprise/${extractSirenFromSiret(etablissement.siret)}`}>
        ← Retour
      </a>
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

    try {
      const etablissement = await getEtablissementWithLatLongFromSlug(slug);
      return {
        props: {
          etablissement,
        },
      };
    } catch (e: any) {
      return { props: { etablissement: { estActif: null, siret: slug } } };
    }
  }
);

export default EtablissementMapPage;
