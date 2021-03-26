import React from 'react';
import InformationTooltip from '.';
import { IAdministrationMetaData } from '../../models/administration';
import { information } from '../icon';

export const DataSource: React.FC<{ shortSourceName: string }> = ({
  shortSourceName,
}) => (
  <div className="data-source">
    <span className="layout-center">{information}</span>
    <span>
      &nbsp;Source des données&nbsp;:&nbsp;
      {shortSourceName}
    </span>
    <style jsx>{`
      .data-source {
        margin-top: 15px;
        display: inline-flex;
        font-size: 0.7rem;
        background-color: #dfdff1;
        color: #000091;
        padding: 2px 7px;
        border-radius: 40px;
      }
    `}</style>
  </div>
);

const DataSourceTooltip: React.FC<{ dataSource: IAdministrationMetaData }> = ({
  dataSource,
}) => (
  <>
    <InformationTooltip
      label={
        <>
          <p>{dataSource.long}</p>
          <br />
          <a href={`/administration/${dataSource.slug}`}>👉 En savoir plus</a>
        </>
      }
    >
      <DataSource shortSourceName={dataSource.short} />
    </InformationTooltip>
  </>
);

export default DataSourceTooltip;
