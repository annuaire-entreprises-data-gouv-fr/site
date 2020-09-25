import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ButtonLink from '../../components/button';
import { formatSiret } from '../../utils/formatting';
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
          <span>
            {!isEntreprise ? (
              <>
                <span>etablissement</span>
                <span>
                  {formatSiret(etablissement.siret)}
                  {etablissement.etat_administratif === 'A' ? (
                    <Tag className="open">en activité</Tag>
                  ) : (
                    <Tag className="closed">fermé</Tag>
                  )}
                </span>
              </>
            ) : (
              <>
                {etablissement.etat_administratif === 'A' ? (
                  <Tag className="open">en activité</Tag>
                ) : (
                  <Tag className="closed">fermé</Tag>
                )}
              </>
            )}
          </span>
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
        display: flex;
        align-items: center;
      }
      .title > span {
        display: flex;
        flex-direction: column;
        margin: 0 10px;
      }
      .title > span > span:last-of-type {
        color: #888;
        font-size: 1.4rem;
        line-height: 1.4rem;
        margin-left: 15px;
        position: relative;
        display: flex;
      }
      .title > span > span:last-of-type:before {
        content: '‣';
        position: absolute;
        left: -15px;
      }
      .title > span > span:first-of-type {
        font-variant: small-caps;
        margin-left: 15px;
        color: #777;
        font-weight: bold;
        line-height: 0.6rem;
        font-size: 0.8rem;
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
