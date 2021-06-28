import React from 'react';
import {
  administrationsLogo,
  administrationsMetaData,
  EAdministration,
} from '../../models/administration';
import { formatDate } from '../../utils/helpers/formatting';
import DataSourceTooltip from '../information-tooltip/data-source-tooltip';

interface ISectionProps {
  title: string;
  width?: number;
  source?: EAdministration;
  id?: string;
}

export const Section: React.FC<ISectionProps> = ({
  id,
  children,
  title,
  source,
  width = 100,
}) => {
  const dataSource = source ? administrationsMetaData[source] : undefined;
  const dataLogo = source ? administrationsLogo[source] : undefined;
  const now = new Date();
  return (
    <>
      <div className="section-container" id={id}>
        <h2>{title}</h2>
        <div>{children}</div>
        {dataSource && (
          <>
            <div className="data-source-tooltip-wrapper">
              <DataSourceTooltip
                dataSource={dataSource}
                lastUpdatedAt={formatDate(now)}
              />
            </div>
            {dataLogo && <div className="logo-wrapper">{dataLogo}</div>}
          </>
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
        .data-source-tooltip-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }

        .logo-wrapper {
          position: absolute;
          min-width: 70px;
          max-width: 100px;
          height: 30px;
          max-height: 30px;
          top: 16px;
          right: 16px;
        }
        .logo-wrapper svg {
          width: 100%;
          height: 100%;
        }
        @media only screen and (min-width: 1px) and (max-width: 600px) {
          .logo-wrapper {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
