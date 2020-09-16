import React from 'react';

interface ISectionProps {
  title: string;
  width?: number;
  id?: string;
}

export const Section: React.FC<ISectionProps> = ({
  id,
  children,
  title,
  width = 100,
}) => (
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
        margin: 40px 0 10px;
        padding: 1rem;
        padding-top: 2rem;
        width: ${width}%;
      }
      .section-container > h2 {
        position: absolute;
        top: -1.6rem;
        left: 20px;
        font-size: 1.1rem;
        line-height: 1.8rem;
        background-color: #dfdff1;
        color: #000091;
        padding: 0 7px;
        border-radius: 2px;
      }
    `}</style>
  </>
);
