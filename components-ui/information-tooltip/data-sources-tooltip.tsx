import React from 'react';
import { information } from '#components-ui/icon';
import { IAdministrationMetaData } from '#models/administrations';
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
        <span className="layout-center">{information}</span>
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
            background-color: #dfdff1;
            color: #000091;
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
