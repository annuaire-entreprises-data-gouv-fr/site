import React from 'react';
import InformationTooltip from '.';
import { IAdministrationMetaData } from '../../models/administrations';
import { information } from '../icon';

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
      <a href={link} className="data-source">
        <span className="layout-center">{information}</span>
        <span>
          &nbsp;Source des données&nbsp;:&nbsp;
          {dataSources.map((dataSource) => dataSource.short).join(', ')}
          {lastUpdatedAt ? <>&nbsp;・&nbsp;{lastUpdatedAt}</> : ''}
        </span>
        <style jsx>{`
          .data-source {
            display: inline-flex;
            font-size: 0.7rem;
            background-color: #dfdff1;
            color: #000091;
            padding: 2px 10px;
            border-radius: 40px;
            box-shadow: none;
            cursor: help;
          }
        `}</style>
      </a>
    </InformationTooltip>
  </>
);

export default DataSourcesTooltip;
