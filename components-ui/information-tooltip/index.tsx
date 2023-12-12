import React, { PropsWithChildren, ReactNode } from 'react';

const computeLeft = (orientation: 'left' | 'right' | 'center', width = 250) => {
  switch (orientation) {
    case 'right':
      return `calc(50% - ${width}px);`;
    case 'left':
      return `50%`;
    case 'center':
    default:
      return `calc(50% - ${Math.round(width / 2)}px)`;
  }
};

const InformationTooltip: React.FC<
  PropsWithChildren<{
    label: ReactNode | string;
    orientation?: 'left' | 'right' | 'center';
    width?: number;
    inlineBlock?: boolean;
    left?: string;
    cursor?: 'help' | 'pointer' | 'auto';
  }>
> = ({
  children,
  label,
  orientation = 'center',
  width = 250,
  inlineBlock = true,
  left = '',
  cursor = 'help',
}) => (
  <>
    <span className="wrapper">
      {children}
      <div className={`tooltip ${orientation}`}>{label}</div>
    </span>
    <style jsx>{`
      .wrapper {
        cursor: ${cursor};
        position: relative;
        display: ${inlineBlock ? 'inline-block' : 'block'};
      }

      .wrapper .tooltip {
        cursor: help;
        font-size: 0.9rem;
        background: #444;
        border-radius: 5px;
        border-bottom-right-radius: ${orientation === 'right' ? 0 : 5}px;
        border-bottom-left-radius: ${orientation === 'left' ? 0 : 5}px;
        bottom: calc(100% + 10px);
        color: #fff;
        left: ${left ? left : computeLeft(orientation, width)};
        display: block;
        visibility: hidden;
        padding: 10px;
        width: ${width}px;
        pointer-events: none;
        position: absolute;
        z-index: 1000;
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

      /*small triangle */
      .wrapper .tooltip.center:after,
      .wrapper .tooltip.left:after,
      .wrapper .tooltip.right:after {
        bottom: -5px;
        content: ' ';
        height: 0;
        position: absolute;
        width: 0;
      }

      .wrapper .tooltip.center:after {
        border-left: solid transparent 5px;
        border-right: solid transparent 5px;
        border-top: solid #444 5px;
        left: 50%;
      }
      .wrapper .tooltip.left:after {
        border-bottom: solid transparent 5px;
        border-right: solid transparent 5px;
        border-left: solid #444 5px;
        left: 0;
      }
      .wrapper .tooltip.right:after {
        border-bottom: solid transparent 5px;
        border-left: solid transparent 5px;
        border-right: solid #444 5px;
        right: 0;
      }

      .wrapper:hover .tooltip,
      .wrapper:focus-within .tooltip {
        visibility: visible;
        pointer-events: auto;
      }

      @media only screen and (min-width: 1px) and (max-width: 576px) {
        .wrapper:hover .tooltip {
          visibility: visible;
          pointer-events: auto;
          opacity: 0.95;
        }
        .wrapper .tooltip {
          transition: opacity 300ms ease-in-out;
          opacity: 0;
          position: fixed;
          width: auto;
          top: 0;
          left: 0;
          right: 0;
          border-radius: 0;
          height: 30%;
          overflow: auto;
        }
        .wrapper .tooltip:after,
        .wrapper .tooltip:before {
          display: none;
        }
      }
    `}</style>
  </>
);

export default InformationTooltip;
