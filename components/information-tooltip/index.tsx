import React, { PropsWithChildren, ReactNode } from 'react';

const left = (orientation: 'left' | 'right' | 'center') => {
  switch (orientation) {
    case 'right':
      return 'calc(100% - 240px);';
    case 'left':
      return 'calc(100% - 10px)';
    case 'center':
    default:
      return 'calc(50% - 115px)';
  }
};

const leftTriangle = (orientation: 'left' | 'right' | 'center') => {
  switch (orientation) {
    case 'right':
      return '97%';
    case 'left':
      return '10%';
    case 'center':
    default:
      return '50%';
  }
};

const InformationTooltip: React.FC<
  PropsWithChildren<{
    label: ReactNode | string;
    orientation?: 'left' | 'right' | 'center';
  }>
> = ({ children, label, orientation = 'center' }) => (
  <>
    <span className="wrapper">
      {children}
      <div className="tooltip">{label}</div>
    </span>
    <style jsx>{`
      .wrapper {
        cursor: help;
        position: relative;
      }

      .wrapper .tooltip {
        font-size: 0.9rem;
        background: #444;
        border-radius: 5px;
        bottom: calc(100% + 10px);
        color: #fff;
        left: ${left(orientation)};
        display: block;
        visibility: hidden;
        padding: 10px;
        width: 250px;
        pointer-events: none;
        position: absolute;
        z-index: 100;
      }

      /* This bridges the gap so you can mouse into the tooltip without it disappearing */
      .wrapper .tooltip:before {
        bottom: -10px;
        content: ' ';
        display: block;
        height: 20px;
        left: 0;
        position: absolute;
        width: 100%;
      }

      /* CSS Triangles - see Trevor's post */
      .wrapper .tooltip:after {
        border-left: solid transparent 5px;
        border-right: solid transparent 5px;
        border-top: solid #444 5px;
        bottom: -5px;
        content: ' ';
        height: 0;
        left: ${leftTriangle(orientation)};
        margin-left: -13px;
        position: absolute;
        width: 0;
      }

      .wrapper:hover .tooltip {
        visibility: visible;
        pointer-events: auto;
      }
    `}</style>
  </>
);

export default InformationTooltip;
