import React, { PropsWithChildren } from 'react';
import Warning from '#components-ui/alerts/warning';
import { questionnaire } from '#components-ui/icon';
import DataSourcesTooltip from '#components-ui/information-tooltip/data-sources-tooltip';
import Logo from '#components-ui/logo';
import { PrintNever } from '#components-ui/print-visibility';
import {
  administrationsMetaData,
  EAdministration,
} from '#models/administrations';
import { formatDate, isTwoMonthOld, formatDateLong } from '#utils/helpers';

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
  const dataSources = sources.map((key) => administrationsMetaData[key]);

  const isOld = lastModified && isTwoMonthOld(lastModified);
  const last = lastModified || new Date();

  const link = `/administration/${dataSources.map((d) => d.slug).join('_')}`;

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
        {dataSources.length > 0 && (
          <div className="administration-page-link">
            <PrintNever>
              <a href={link}>
                {questionnaire}
                &nbsp;Une erreur ou une question sur ces données ?
              </a>
            </PrintNever>
            <DataSourcesTooltip
              dataSources={dataSources}
              lastUpdatedAt={formatDate(last)}
              link={link}
            />
          </div>
        )}
        <div className="section-logo-wrapper">
          {dataSources.map(
            ({ slug, long, logoType }) =>
              logoType && (
                <a
                  key={long}
                  href={link}
                  title={long}
                  className="no-style-link"
                >
                  {logoType === 'portrait' ? (
                    <Logo title={long} slug={slug} width={70} height={40} />
                  ) : (
                    <Logo title={long} slug={slug} width={170} height={40} />
                  )}
                </a>
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
          margin-bottom: 25px;
          display: inline-block;
          font-size: 1.1rem;
          line-height: 1.8rem;
          background-color: #dfdff1;
          color: #000091;
          padding: 0 7px;
          border-radius: 2px;
          max-width: calc(100% - 40px);
        }

        .administration-page-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
        }
        .administration-page-link > a {
          font-size: 0.9rem;
        }

        .section-logo-wrapper {
          position: absolute;
          top: 25px;
          right: 16px;
          display: flex;
          justify-content: end;
        }

        @media only screen and (min-width: 1px) and (max-width: 750px) {
          .section-logo-wrapper {
            display: none;
          }

          .administration-page-link {
            flex-direction: column;
          }
          .administration-page-link > a {
            margin-bottom: 15px;
          }
        }
      `}</style>
    </>
  );
};
