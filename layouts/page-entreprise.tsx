import React from 'react';
import Page from '.';
import Title, { FICHE } from '../components/title-section';
import { IUniteLegale } from '../models';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  uniteLegale: IUniteLegale;
  currentTab: FICHE;
}

const PageEntreprise: React.FC<IProps> = ({
  children,
  title,
  description,
  canonical,
  noIndex = false,
  uniteLegale,
  currentTab,
}) => (
  <Page
    small={true}
    title={title}
    canonical={canonical}
    noIndex={noIndex}
    description={description}
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={currentTab} />
      <div>{children}</div>
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

export default PageEntreprise;
