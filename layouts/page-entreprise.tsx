import React from 'react';
import Page from '.';
import IsActiveTag from '../components/is-active-tag';
import { Tag } from '../components/tag';
import Title, { FICHE, Tabs } from '../components/title-section';
import { IUniteLegale } from '../models';
import { capitalize, formatIntFr } from '../utils/helpers/formatting';
import PageCompteDirigeant from './page-compte-dirigeant';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  uniteLegale: IUniteLegale;
  currentTab: FICHE;
  estDirigeant?: boolean;
}

const PageEntreprise: React.FC<IProps> = ({
  children,
  title,
  description,
  canonical,
  noIndex = false,
  uniteLegale,
  currentTab,
  estDirigeant = true,
}) => (
  <>
    {estDirigeant ? (
      <PageCompteDirigeant
        title={title}
        canonical={canonical}
        description={description}
      >
        <div className="content-container dirigeant">
          <div className="menu">
            <div className="fr-header__logo">
              <a href="/" title="République française">
                <p className="fr-logo">
                  République
                  <br />
                  française
                </p>
              </a>
            </div>
            <div className="back">
              <a href="">← Retourner à l’Annuaire des Entreprises</a>
            </div>
            <div>
              <Tabs
                siren={uniteLegale.siren}
                ficheType={currentTab}
                estDirigeant={true}
              />
            </div>
          </div>
          <div className="body">
            <h1>{capitalize(currentTab)}</h1>
            <div>
              <b>{uniteLegale.nomComplet} ‣ </b>
              <span>unité légale ‣ {formatIntFr(uniteLegale.siren)}</span>
              <span>
                {!uniteLegale.estDiffusible ? (
                  <>
                    <Tag>Non-diffusible</Tag>
                    <IsActiveTag isActive={null} isUniteLegale={true} />
                  </>
                ) : (
                  <IsActiveTag
                    isActive={uniteLegale.estActive}
                    isUniteLegale={true}
                  />
                )}
              </span>
              <br />
              <br />
            </div>
            {children}
          </div>
        </div>
        <style jsx>{`
          .content-container.dirigeant h1 {
            margin: 30px 0 20px;
          }
          .content-container.dirigeant {
            margin: 0 auto 0;
            display: flex;
          }
          .content-container.dirigeant .menu {
            width: 270px;
            flex-shrink: 0;
            background-color: #fff;
            border-right: 1px solid #dfdff1;
            box-shadow: 12px 0 10px -10px #dfdff1;
            margin-right: 30px;
            padding: 0;
            height: 100vh;
            position: sticky;
            top: 0;
          }
          .content-container.dirigeant .menu > .fr-header__logo {
            margin: 20px 10px;
            padding: 0;
          }
          .content-container.dirigeant .menu > .back {
            margin: 20px 10px;
          }
        `}</style>
      </PageCompteDirigeant>
    ) : (
      <Page
        headerWithSearch={true && !estDirigeant}
        title={title}
        canonical={canonical}
        noIndex={noIndex}
        description={description}
      >
        <div className="content-container">
          <div className="header">
            <Title uniteLegale={uniteLegale} />
            <Tabs
              siren={uniteLegale.siren}
              ficheType={currentTab}
              estDirigeant={false}
            />
          </div>
          <div className="body">{children}</div>
        </div>
        <style jsx>{`
          .content-container {
            margin: 20px auto 40px;
          }
        `}</style>
      </Page>
    )}
  </>
);

export default PageEntreprise;
