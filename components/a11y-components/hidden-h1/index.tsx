import React from 'react';

const HiddenH1: React.FC<{ title: string }> = ({ title }) => (
  <h1
    style={{
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: '1px',
      overflow: 'hidden',
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px',
      zIndex: -'1',
      userSelect: 'none',
    }}
  >
    {title}
  </h1>
);

export default HiddenH1;
