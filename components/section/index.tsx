import React, { PropsWithChildren } from 'react';
import {
  administrationsMetaData,
  EAdministration,
} from '../../models/administration';
import { isTwoMonthOld } from '../../utils/helpers/checks';
import { formatDate, formatDateLong } from '../../utils/helpers/formatting';
import Warning from '../../components-ui/alerts/warning';
import DataSourceTooltip from '../../components-ui/information-tooltip/data-source-tooltip';
import { cma, inpi, insee, dila, vies } from '../administrations/logos';

interface IAdministrationsLogos {
  [key: string]: JSX.Element;
}

const administrationsLogo: IAdministrationsLogos = {
  [EAdministration.INPI]: inpi,
  [EAdministration.CMAFRANCE]: cma,
  [EAdministration.INSEE]: insee,
  [EAdministration.DILA]: dila,
  [EAdministration.VIES]: vies,
};

interface ISectionProps {
  title: string;
  width?: number;
  sources?: EAdministration[];
  id?: string;
  lastModified?: string | null;
}

export const Section: React.FC<PropsWithChildren<ISectionProps>> = ({
  id,
  children,
  title,
  sources = [],
  lastModified = null,
  width = 100,
}) => {
  const dataSources = sources.map((source) => {
    return {
      data: administrationsMetaData[source],
      logo: administrationsLogo[source],
    };
  });

  const isOld = lastModified && isTwoMonthOld(lastModified);
  const last = lastModified || new Date();

  return (
    <>
      <div className="section-container" id={id}>
        <h2>{title}</h2>
        {isOld && lastModified && (
          <Warning>
            Ces données n’ont pas été mises à jour depuis plus de deux mois.
            Dernière mise à jour : {formatDateLong(lastModified)}.
          </Warning>
        )}
        <div>{children}</div>
        <div className="data-source-tooltip-wrapper">
          {dataSources.map(
            ({ data, logo }) =>
              data && (
                <>
                  <DataSourceTooltip
                    dataSource={data}
                    lastUpdatedAt={formatDate(last)}
                  />
                  {logo && (
                    <a
                      href={`/administration/${data.slug}`}
                      className="logo-wrapper"
                      title={data.long}
                    >
                      {logo}
                    </a>
                  )}
                </>
              )
          )}
        </div>
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
          height: 50px;
          max-height: 50px;
          top: 16px;
          right: 16px;
          box-shadow: none;
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
