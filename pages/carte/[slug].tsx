import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  IEtablissement,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../models';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSiretIntrouvable,
} from '../../utils/redirect';
import MapEtablissement from '../../components/mapbox/map-etablissement';
import { getEtablissement } from '../../models/etablissement';

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
    if (e instanceof NotASiretError) {
      redirectPageNotFound(context.res, siret);
    } else if (
      e instanceof SiretNotFoundError ||
      e instanceof SirenNotFoundError
    ) {
      redirectSiretIntrouvable(context.res, siret);
    } else {
      redirectServerError(context.res, e.message);
    }

    return { props: {} };
  }
};

export default EtablissementMapPage;
