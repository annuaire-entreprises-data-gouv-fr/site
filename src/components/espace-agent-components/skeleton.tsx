import { useLocation } from "@tanstack/react-router";
import type React from "react";
import { Bone } from "#/components-ui/skeleton";
import AgentNavigation from "./agent-navigation";
import styles from "./skeleton.module.css";

const Lines: React.FC<{ count: number }> = ({ count }) => (
  <div className={styles.lines}>
    {Array.from({ length: count }, (_, i) => (
      <Bone key={i} width={`${40 + ((i * 17) % 45)}%`} />
    ))}
  </div>
);

const TableSkeleton: React.FC<{ rows: number; withActions?: boolean }> = ({
  rows,
  withActions = false,
}) => (
  <div className={styles.table}>
    {Array.from({ length: rows }, (_, i) => (
      <div className={styles.tableRow} key={i}>
        <Bone width={`${25 + ((i * 13) % 30)}%`} />
        <Bone height="1.5rem" inline={true} width="120px" />
        {withActions && <Bone height="2.5rem" inline={true} width="110px" />}
      </div>
    ))}
  </div>
);

const GroupCardSkeleton = () => (
  <div className={styles.card}>
    <Bone height="2rem" width="40%" />
    <Bone height="1.25rem" width="160px" />
    <Lines count={4} />
    <Bone height="2.5rem" width="170px" />
  </div>
);

const PageSkeleton: React.FC<{ children: React.ReactNode; label: string }> = ({
  children,
  label,
}) => (
  <>
    <AgentNavigation />
    <div aria-busy="true">
      <p className="fr-sr-only" role="status">
        {label}
      </p>
      <div aria-hidden="true">{children}</div>
    </div>
  </>
);

/**
 * Placeholder for the agent home page while its loader is pending
 */
export const AccueilPageSkeleton = () => (
  <PageSkeleton label="Chargement de votre espace…">
    <section className="fr-grid-row fr-mt-5w">
      <div className="fr-col-md-7 fr-col-12">
        <Bone className={styles.title} height="2.5rem" width="60%" />
        <TableSkeleton rows={4} />
      </div>
      <div className="fr-col-md-1 fr-col-12" />
      <div className="fr-col-md-4 fr-col-12">
        <div className={styles.card}>
          <Bone height="1.5rem" width="70%" />
          <Lines count={3} />
          <Bone height="2.5rem" width="60%" />
        </div>
      </div>
    </section>
  </PageSkeleton>
);

/**
 * Placeholder for the groups list while its loader is pending
 */
export const GroupsListPageSkeleton = () => (
  <PageSkeleton label="Chargement de vos groupes…">
    <Bone className={styles.title} height="2.5rem" width="30%" />
    <Lines count={2} />
    <GroupCardSkeleton />
    <GroupCardSkeleton />
  </PageSkeleton>
);

/**
 * Placeholder for a group details page while its loader is pending
 */
export const GroupDetailsPageSkeleton = () => (
  <PageSkeleton label="Chargement du groupe…">
    <Bone className={styles.title} width="200px" />
    <Bone className={styles.title} height="2.5rem" width="45%" />
    <Lines count={3} />
    <Bone height="2.5rem" width="170px" />
    <TableSkeleton rows={8} withActions={true} />
  </PageSkeleton>
);

/**
 * Placeholder for the whole compte section, shown while the shared layout
 * data is pending: picks the skeleton of the page being loaded
 */
export const CompteRoutePendingSkeleton = () => {
  const { pathname } = useLocation();

  if (/^\/compte\/mes-groupes\/[^/]+/.test(pathname)) {
    return <GroupDetailsPageSkeleton />;
  }
  if (pathname.startsWith("/compte/mes-groupes")) {
    return <GroupsListPageSkeleton />;
  }
  return <AccueilPageSkeleton />;
};
