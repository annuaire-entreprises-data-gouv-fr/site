import React from 'react';
import { questionFill } from '../icon';
import { PrintNever } from '../print-visibility';

export const Question: React.FC<{}> = () => (
  <PrintNever>
    <div
      role="dialog"
      aria-label="Une question"
      className="question-bottom-right layout-center"
    >
      <a className="no-style-link" href="/faq">
        <span>Une question&nbsp;</span>
        {questionFill}
      </a>
    </div>
    <style jsx>{`
      .question-bottom-right {
        position: fixed;
        right: 60px;
        bottom: 60px;
        z-index: 100;
        font-family: 'Marianne', sans-serif;
      }

      .question-bottom-right > a {
        background-color: #000091;
        color: #fff;
        border-radius: 30px;
        padding: 15px 20px;
        font-size: 1.1rem;
        display: flex;
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

      @media only screen and (min-width: 1px) and (max-width: 600px) {
        .question-bottom-right {
          bottom: 50px;
          right: 10px;
        }
        .question-bottom-right > a {
          padding: 15px;
          border-radius: 50px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .question-bottom-right span {
          display: none;
        }
      }
    `}</style>
  </PrintNever>
);
