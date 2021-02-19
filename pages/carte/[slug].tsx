import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getEtablissement, IEtablissement } from '../../models';
import { redirectSiretIntrouvable } from '../../utils/redirect';
import MapEtablissement from '../../components/mapbox/map-etablissement';

interface IProps {
  etablissement: IEtablissement;
}

const About: React.FC<IProps> = ({ etablissement }) => (
  <Page
    small={true}
    map={true}
    noIndex={true}
    title="Carte"
    canonical={`https://annuaire-entreprises.data.gouv.fr/carte/${etablissement.siret}`}
  >
    <div className="map-container">
      <MapEtablissement etablissement={etablissement} />
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { siret } = context.query;

  const etablissement = await getEtablissement(siret as string);
  if (!etablissement) {
    redirectSiretIntrouvable(context.res, siret as string);
  }
  return {
    props: {
      etablissement,
    },
  };
};

export default About;
