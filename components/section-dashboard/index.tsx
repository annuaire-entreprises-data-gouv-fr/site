import React from 'react';
import { TwoColumnTable } from '../table/simple';

interface ISectionProps {
  title: string;
  id?: string;
}

export const SectionDashboard: React.FC<ISectionProps> = ({
  id,
  children,
  title,
}) => {
  return (
    <>
      <div className="section-container" id={id}>
        <h2>{title}</h2>
        <div>{children}</div>
      </div>

      <style jsx>{`
        .section-container {
          border: 2px solid #dfdff1;
          border-radius: 2px;
          position: relative;
          margin: 10px 0 10px;
          padding: 1rem;
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
      `}</style>
    </>
  );
};

export default SectionDashboard;
