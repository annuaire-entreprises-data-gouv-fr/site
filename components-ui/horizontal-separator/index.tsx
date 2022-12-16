import React from 'react';

export const SimpleSeparator = () => (
  <>
    <div className="simple-horizontal-separator" />
    <style jsx>{`
      div.simple-horizontal-separator {
        margin: 15px 0;
        width: 100%;
        background-color: #dfdff1;
        height: 1px;
      }
    `}</style>
  </>
);

export const HorizontalSeparator = () => (
  <>
    <div className="horizontal-separator layout-center">
      <span className="line" />
      <span className="circle" />
      <span className="line" />
    </div>
    <style jsx>{`
      div.horizontal-separator {
        width: 100%;
        padding: 40px 0;
      }
      div.horizontal-separator > span.line {
        width: 50px;
        background-color: #dfdff1;
        height: 2px;
        margin: 0 10px;
      }
      div.horizontal-separator > span.circle {
        width: 7px;
        height: 7px;
        border-radius: 20px;
        background-color: #dfdff1;
      }
    `}</style>
  </>
);
