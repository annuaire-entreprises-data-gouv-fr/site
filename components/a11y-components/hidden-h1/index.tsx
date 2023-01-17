import React from 'react';

const HiddenH1: React.FC<{ title: string }> = ({ title }) => (
  <>
    <h1>{title}</h1>
    <style jsx>{`
      h1 {
        clip: rect(1px, 1px, 1px, 1px);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
        z-index: -1;
        user-select: none;
      }
    `}</style>
  </>
);

export default HiddenH1;
