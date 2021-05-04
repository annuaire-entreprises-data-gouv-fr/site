import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement } from '../../models';
import MapEtablissement from '../../components/mapbox/map-etablissement';
import { getEtablissement } from '../../models/etablissement';
import {
  redirectIfIssueWithSiren,
  redirectIfIssueWithSiret,
} from '../../utils/redirects/routers';

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
    <div className="map-container">
      <MapEtablissement etablissement={etablissement} />
    </div>
    <style jsx>
      {`
        .map-container {
          display: flex;
          flex-direction: row-reverse;
          height: calc(100vh - 180px);
        }
      `}
    </style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  try {
    const etablissement = await getEtablissement(siret);
    return {
      props: {
        etablissement,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiret(context.res, e, siret);
    redirectIfIssueWithSiren(context.res, e, siret);

    return { props: {} };
  }
};

export default EtablissementMapPage;
