import type React from "react";
import type { PropsWithChildren } from "react";
import { Warning } from "#/components-ui/alerts";
import { Icon } from "#/components-ui/icon/wrapper";
import DataSourcesTooltip from "#/components-ui/information-tooltip/data-sources-tooltip";
import { administrationsMetaData } from "#/models/administrations";
import type { EAdministration } from "#/models/administrations/e-administration";
import constants from "#/models/constants";
import { formatDate, formatDateLong, isTwoMonthOld } from "#/utils/helpers";
import SectionErrorBoundary from "./section-error-boundary";
import style from "./style.module.css";
export interface ISectionProps {
  header?: React.ReactNode;
  id?: string;
  isProtected?: boolean;
  lastModified?: string | null;
  sources?: EAdministration[];
  title: string;
  width?: number;
}

export const Section: React.FC<PropsWithChildren<ISectionProps>> = ({
  id,
  children,
  title,
  sources = [],
  lastModified = null,
  width = 100,
  isProtected = false,
  header,
}) => {
  const dataSources = Array.from(new Set(sources)).map(
    (key) => administrationsMetaData[key]
  );

  const isOld = lastModified && isTwoMonthOld(lastModified);
  const last = lastModified || new Date();

  const faqLink = dataSources.map((d) => d.slug).join("_");

  const borderColor = isProtected
    ? constants.colors.espaceAgentPastel
    : constants.colors.pastelBlue;
  const titleColor = isProtected
    ? constants.colors.espaceAgent
    : constants.colors.frBlue;

  return (
    <SectionErrorBoundary title={title}>
      <section
        aria-label={title}
        className={style["section-container"]}
        id={id}
        style={{ width: `${width}%`, borderColor }}
      >
        {isProtected && (
          <aside className={style.protected}>
            <Icon size={12} slug="lockFill">
              Réservé aux agents publics
            </Icon>
          </aside>
        )}
        <header className={style["section-header"]}>
          <h2 style={{ color: titleColor, backgroundColor: borderColor }}>
            {title}
          </h2>
        </header>

        {isOld && lastModified && (
          <Warning>
            Ces données n’ont pas été mises à jour depuis plus de deux mois.
            Dernière mise à jour : {formatDateLong(lastModified)}.
          </Warning>
        )}
        {header}
        <div>{children}</div>
        {dataSources.length > 0 && (
          <footer className={style["administration-page-link"]}>
            <DataSourcesTooltip
              dataSources={dataSources}
              lastUpdatedAt={formatDate(last)}
              link={faqLink}
              orientation="right"
            />
          </footer>
        )}
      </section>
    </SectionErrorBoundary>
  );
};
