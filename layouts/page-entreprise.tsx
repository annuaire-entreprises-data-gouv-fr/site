import React from 'react';
import Page from '.';
import SocialMedia from '../components/social-media';
import Title, { FICHE, LateralMenu, Tabs } from '../components/title-section';
import { UnitLegaleDescription } from '../components/unite-legale-description';
import { IUniteLegale } from '../models';
import { PageContext } from './page-context';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  uniteLegale: IUniteLegale;
  currentTab: FICHE;
}

class PageEntreprise extends React.Component<IProps> {
  static contextType = PageContext;

  render() {
    const {
      children,
      title,
      description,
      canonical,
      noIndex = false,
      uniteLegale,
      currentTab,
    } = this.props;

    return (
      <Page
        title={title}
        noIndex={noIndex}
        canonical={canonical}
        description={description}
      >
        {this.context.dirigeant ? (
          <>
            <div className="small-caps">Votre entreprise</div>
            <Title uniteLegale={uniteLegale} />
            <br />
            <div className="content-container">
              <LateralMenu
                siren={uniteLegale.siren}
                ficheType={currentTab}
                estDirigeant={true}
              />
              <div className="body">{children}</div>
            </div>
            <style jsx>{`
              .small-caps {
                font-variant: small-caps;
                margin-top: 30px;
              }
              .content-container {
                margin: 0 auto 0;
                display: flex;
              }
            `}</style>
          </>
        ) : (
          <div className="content-container">
            <div className="header">
              <br />
              <Title uniteLegale={uniteLegale} />
              <SocialMedia siren={uniteLegale.siren} />
              {!uniteLegale.estDiffusible ? (
                <p>
                  Les informations concernant cette entité ne sont pas
                  publiques.
                </p>
              ) : (
                <UnitLegaleDescription uniteLegale={uniteLegale} />
              )}
              <div>
                C’est votre entreprise ?{' '}
                <a href={`/compte/connexion?siren=${uniteLegale.siren}`}>
                  → Accédez à votre espace entrepreneur.
                </a>
              </div>
              <br />
              <Tabs
                siren={uniteLegale.siren}
                ficheType={currentTab}
                estDirigeant={false}
              />
            </div>
            <div className="body">{children}</div>
            <style jsx>{`
              .content-container {
                margin: 20px auto 40px;
              }
            `}</style>
          </div>
        )}
      </Page>
    );
  }
}

export default PageEntreprise;
