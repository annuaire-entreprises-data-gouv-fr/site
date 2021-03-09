import React, { PropsWithChildren } from 'react';

const InformationTooltip: React.FC<PropsWithChildren<{ label: string }>> = ({
  children,
  label,
}) => (
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
        left: calc(50% - 140px);
        display: none;
        padding: 10px;
        width: 300px;
        pointer-events: none;
        position: absolute;
      }

      /* This bridges the gap so you can mouse into the tooltip without it disappearing */
      .wrapper .tooltip:before {
        bottom: -20px;
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
        left: 50%;
        margin-left: -13px;
        position: absolute;
        width: 0;
      }

      .wrapper:hover .tooltip {
        display: block;
        pointer-events: auto;
      }

      /* IE can just show/hide with no transition */
      .lte8 .wrapper .tooltip {
        display: none;
      }

      .lte8 .wrapper:hover .tooltip {
        display: block;
      }
    `}</style>
  </>
);

export default InformationTooltip;
