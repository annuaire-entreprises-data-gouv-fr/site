import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ButtonLink from '../../components/button';
import { formatNumbersFr, formatSiret } from '../../utils/formatting';
import { Tag } from '../../components/tag';
import { getCompanyTitle, libelleFromCodeNaf } from '../../utils/helper';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import { download } from '../../static/icon';
import EtablissementSection from '../../components/etablissementSection';
import EntrepriseSection from '../../components/entrepriseSection';
import EtablissementListeSection from '../../components/etablissementListeSection';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isEntreprise: boolean; // true if entreprise, false if etablissement
}

const About: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isEntreprise = false,
}) => (
  <Page small={true} useMapbox={true}>
    <div className="content-container">
      <div className="header-section">
        <div className="title">
          <h1>
            <a href={`/entreprise/${uniteLegale.siren}`}>
              {getCompanyTitle(uniteLegale)}
            </a>
          </h1>
          <div>
            <span>fiche {isEntreprise ? 'entreprise' : 'etablissement'}</span>
            {!isEntreprise ? (
              <span> ‣ {formatSiret(etablissement.siret)}</span>
            ) : (
              <span> ‣ {formatNumbersFr(uniteLegale.siren)}</span>
            )}
            <span>
              {etablissement.etat_administratif === 'A' ? (
                <Tag className="open">en activité</Tag>
              ) : (
                <Tag className="closed">fermé</Tag>
              )}
            </span>
          </div>
        </div>
        <div className="cta">
          <ButtonLink
            target="_blank"
            href={`/api/immatriculation?siren=${etablissement.siren}?format=pdf`}
          >
            {download}
            <span style={{ width: '5px' }} />
            Justificatif d'immatriculation
          </ButtonLink>
          <span style={{ width: '5px' }} />
          <ButtonLink
            target="_blank"
            href={`/api/immatriculation?siren=${etablissement.siren}`}
            alt
          >
            Fiche d'immatriculation
          </ButtonLink>
        </div>
      </div>
      {!isEntreprise && (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
      )}
      <EntrepriseSection uniteLegale={uniteLegale} />
      <EtablissementListeSection uniteLegale={uniteLegale} />
    </div>
    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .title {
        margin: 20px 0 10px;
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: center;
      }
      .title h1 {
        margin: 0;
        line-height: 2rem;
      }
      .title h1 > a {
        margin: 0;
        padding: 0;
      }
      .title > div > span {
        color: #666;
      }
      .title > div > span:first-of-type {
        font-variant: small-caps;
        font-size: 1.1rem;
      }

      .content-container {
        margin: 20px auto 40px;
      }
      .cta {
        flex-direction: row;
        display: flex;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siretOrSiren = context.params.slug;

  if (siretOrSiren && siretOrSiren.length === 9) {
    // siege social
    const uniteLegale = await getUniteLegale(siretOrSiren as string);
    return {
      props: {
        etablissement: uniteLegale.etablissement_siege,
        uniteLegale,
        isEntreprise: true,
      },
    };
  }

  const etablissement = await getEtablissement(siretOrSiren as string);
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  return {
    props: {
      etablissement,
      uniteLegale,
      isEntreprise: false,
    },
  };
};

export default About;
