import React, { PropsWithChildren } from 'react';
import { Warning } from '#components-ui/alerts';
import { Icon } from '#components-ui/icon/wrapper';
import DataSourcesTooltip from '#components-ui/information-tooltip/data-sources-tooltip';
import Logo from '#components-ui/logo';
import { administrationsMetaData } from '#models/administrations';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { formatDate, formatDateLong, isTwoMonthOld } from '#utils/helpers';
import SectionErrorBoundary from './section-error-boundary';
import style from './style.module.css';
export interface ISectionProps {
  title: string;
  width?: number;
  sources?: EAdministration[];
  id?: string;
  lastModified?: string | null;
  isProtected?: boolean;
}

export const Section: React.FC<PropsWithChildren<ISectionProps>> = ({
  id,
  children,
  title,
  sources = [],
  lastModified = null,
  width = 100,
  isProtected = false,
}) => {
  const dataSources = Array.from(new Set(sources)).map(
    (key) => administrationsMetaData[key]
  );

  const isOld = lastModified && isTwoMonthOld(lastModified);
  const last = lastModified || new Date();

  const faqLink = `/administration/${dataSources.map((d) => d.slug).join('_')}`;

  const borderColor = isProtected
    ? constants.colors.espaceAgentPastel
    : constants.colors.pastelBlue;
  const titleColor = isProtected
    ? constants.colors.espaceAgent
    : constants.colors.frBlue;

  return (
    <SectionErrorBoundary title={title}>
      <div
        className={style['section-container']}
        id={id}
        style={{ width: `${width}%`, borderColor }}
      >
        {isProtected && (
          <div className={style.protected}>
            <Icon size={12} slug="lockFill">
              Réservé aux agents publics
            </Icon>
          </div>
        )}
        <div className={style['section-header']}>
          <h2 style={{ color: titleColor, backgroundColor: borderColor }}>
            {title}
          </h2>
          <div className={style['section-logo-wrapper']}>
            {dataSources.map(
              ({ slug, long, logoType }) =>
                logoType && (
                  <a
                    key={long}
                    href={faqLink}
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

        {isOld && lastModified && (
          <Warning>
            Ces données n’ont pas été mises à jour depuis plus de deux mois.
            Dernière mise à jour : {formatDateLong(lastModified)}.
          </Warning>
        )}
        <div>{children}</div>
        {dataSources.length > 0 && (
          <div className={style['administration-page-link']}>
            <DataSourcesTooltip
              dataSources={dataSources}
              lastUpdatedAt={formatDate(last)}
              link={faqLink}
              orientation="right"
            />
          </div>
        )}
      </div>
    </SectionErrorBoundary>
  );
};
