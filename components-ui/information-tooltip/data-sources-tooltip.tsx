import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { IAdministrationMetaData } from '#models/administrations';
import constants from '#models/constants';
import InformationTooltip from '.';

const DataSourcesTooltip: React.FC<{
  dataSources: IAdministrationMetaData[];
  lastUpdatedAt?: string | Date;
  link: string;
}> = ({ dataSources, lastUpdatedAt, link }) => (
  <>
    <InformationTooltip
      orientation="center"
      label={
        <>
          {dataSources.map((dataSource) => (
            <React.Fragment key={dataSource.long}>
              <div>{dataSource.long}.</div>
            </React.Fragment>
          ))}
          <br />
          <a rel="nofollow" href={link}>
            👉 En savoir plus
          </a>
        </>
      }
    >
      <a href={link} className="data-source no-style-link">
        <span className="layout-center">
          <Icon color={constants.colors.frBlue} size={12} slug="information" />
        </span>
        <span>
          &nbsp;Source{dataSources.length > 1 ? 's' : ''}&nbsp;:&nbsp;
          {dataSources.map((dataSource) => dataSource.short).join(', ')}
          {lastUpdatedAt ? (
            <>
              &nbsp;・&nbsp;mise&nbsp;à&nbsp;jour&nbsp;le&nbsp;{lastUpdatedAt}
            </>
          ) : (
            ''
          )}
        </span>
        <style jsx>{`
          .data-source {
            display: inline-flex;
            font-size: 0.7rem;
            background-color: ${constants.colors.pastelBlue};
            color: ${constants.colors.frBlue};
            padding: 2px 10px;
            border-radius: 40px;
            cursor: help;
          }
          .data-source:hover {
            background-color: #d3d3ec;
          }
        `}</style>
      </a>
    </InformationTooltip>
  </>
);

export default DataSourcesTooltip;
