import { PropsWithChildren } from 'react';

const SectionDashboardGrid: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => (
  <div className="section-dashboard-grid">
    {children}
    <style jsx>{`
      .section-dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 0 20px;
      }
    `}</style>
  </div>
);

export default SectionDashboardGrid;
