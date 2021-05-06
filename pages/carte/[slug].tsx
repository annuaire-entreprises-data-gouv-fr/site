import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement } from '../../models';
import MapEtablissement from '../../components/mapbox/map-etablissement';
import { getEtablissementWithLatLongFromSlug } from '../../models/etablissement';
import { TitleEtablissement } from '../../components/title-etablissement-section';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';

interface IProps {
  etablissement: IEtablissement;
}

const EtablissementMapPage: React.FC<IProps> = ({ etablissement }) => (
  <Page
    small={true}
    map={true}
    noIndex={true}
    title="Carte"
    canonical={`https://annuaire-entreprises.data.gouv.fr/carte/${etablissement.siret}`}
  >
    <div className="fr-container">
      <br />
      <a href={`/entreprise/${extractSirenFromSiret(etablissement.siret)}`}>
        ← Retour
      </a>
      {etablissement.latitude && etablissement.longitude ? (
        <>
          <TitleEtablissement
            etablissement={etablissement}
            title="Géolocalisation de l’établissement"
          />
          <br />
          <div className="map-container">
            <MapEtablissement etablissement={etablissement} />
          </div>
          <br />
        </>
      ) : (
        <p>
          <br />
          <i>La géolocalisation de cet établissement est introuvable.</i>
        </p>
      )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  try {
    const etablissement = await getEtablissementWithLatLongFromSlug(siret);
    return {
      props: {
        etablissement,
      },
    };
  } catch (e) {
    return { props: { etablissement: { siret } } };
  }
};

export default EtablissementMapPage;
