import React from 'react';
import {
  administrationsMetaData,
  EAdministration,
} from '../../models/administration';
import { information } from '../icon';
import InformationTooltip from '../information-tooltip';

interface ISectionProps {
  title: string;
  width?: number;
  source?: EAdministration;
  id?: string;
}

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

export const Section: React.FC<ISectionProps> = ({
  id,
  children,
  title,
  source,
  width = 100,
}) => {
  const dataSource = source ? administrationsMetaData[source] : undefined;
  return (
    <>
      <div className="section-container" id={id}>
        <h2>{title}</h2>
        <div>{children}</div>
        {dataSource && (
          <div className="layout-right">
            <InformationTooltip label={dataSource.long}>
              <DataSource shortSourceName={dataSource.short} />
            </InformationTooltip>
          </div>
        )}
      </div>
      <style jsx>{`
        .section-container {
          border: 2px solid #dfdff1;
          border-radius: 2px;
          position: relative;
          margin: 10px 0 10px;
          padding: 1rem;
          width: ${width}%;
        }
        .section-container > h2 {
          margin-top: 0;
          display: inline-block;
          font-size: 1.1rem;
          line-height: 1.8rem;
          background-color: #dfdff1;
          color: #000091;
          padding: 0 7px;
          border-radius: 2px;
          max-width: calc(100% - 40px);
        }
      `}</style>
    </>
  );
};
