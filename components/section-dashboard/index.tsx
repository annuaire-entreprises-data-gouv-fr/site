import React from 'react';

interface ISectionProps {
  title: string;
  id?: string;
  moreTo?: string;
}

export const SectionDashboard: React.FC<ISectionProps> = ({
  id,
  children,
  title,
  moreTo,
}) => {
  return (
    <>
      <div className="section-container" id={id}>
        <h2>{title}</h2>
        <div className="children-container">{children}</div>
        {moreTo && (
          <div className="section-container-more layout-right">
            <a href={moreTo}>→ Tout voir</a>
          </div>
        )}
      </div>

      <style jsx>{`
        .section-container {
          border: 2px solid #dfdff1;
          border-radius: 2px;
          position: relative;
          margin: 10px 0 10px;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }
        .section-container > h2 {
          margin-top: 0;
          display: inline-block;
          font-size: 1.2rem;
          line-height: 1.8rem;
          color: #000091;
          padding: 0 7px 10px;
          border-radius: 2px;
          max-width: calc(100% - 40px);
        }

        .section-container > .children-container {
          flex-grow: 1;
        }

        .section-container-more {
          font-size: 0.9rem;
          margin: 10px;
          margin-top: 15px;
        }
      `}</style>
    </>
  );
};

export default SectionDashboard;
