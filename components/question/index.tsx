import React, { PropsWithChildren } from 'react';

export const Question: React.FC<{}> = () => (
  <>
    <div className="question-bottom-right">
      <a className="dont-apply-link-style" href="/faq">
        Une question ?
      </a>
    </div>
    <style jsx>{`
      .question-bottom-right {
        position: fixed;
        right: 50px;
        bottom: 50px;
      }

      .question-bottom-right > a {
        background-color: #000091;
        color: #fff;
        border-radius: 30px;
        padding: 10px 15px;
        font-size: 1.1rem;

        display: inline-block;
        color: #fff;
        text-decoration: none;
        box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
        transition: margin 100ms ease-in-out, box-shadow 100ms ease-in-out;
        margin-bottom: 0;
      }
      .question-bottom-right:hover > a {
        box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.3);
        margin-bottom: 5px;
      }

      .tag.closed {
        color: #914141;
        background-color: #ffe5e5;
      }
      .tag.open {
        color: #326f00;
        background-color: #cdf2c0;
      }
    `}</style>
  </>
);
