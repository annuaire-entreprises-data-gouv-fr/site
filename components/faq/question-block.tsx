import React, { PropsWithChildren } from 'react';
import randomId from '../../utils/helpers/randomId';

const QuestionBlock: React.FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  const id = randomId();
  return (
    <>
      <div className="container">
        <input
          type="checkbox"
          value="selected"
          id={id}
          className="toggle__input"
        />
        <label htmlFor={id}>{title}</label>
        <div>{children}</div>
      </div>

      <style jsx>{`
        div.container > div {
          max-height: 0;
          overflow: hidden;
          transition: max-height 150ms ease-in-out, padding 150ms ease-in-out;
          background-color: #f3f3f3;
          border-radius: 2px;
          padding: 0 15px 15px;
          display: block;
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1.6rem;
          padding: 10px 0;
          cursor: pointer;
          position: relative;
          margin-right: 25px;
        }
        label:after {
          content: '▾';
          position: absolute;
          color: #000091;
          right: -25px;
          top: 20px;
          transition: transform 200ms ease-in-out;
        }

        .toggle__input {
          display: none;
        }
        .toggle__input:checked ~ div {
          max-height: 500px;
        }
        .toggle__input:checked ~ label:after {
          transform: rotate(-180deg);
        }
        .toggle__input:not(:checked) ~ div {
          max-height: 0;
          padding: 0 15px;
        }
        .toggle__input:not(:checked) ~ label:after {
          transform: rotate(0deg);
        }

        @media only screen and (min-width: 1px) and (max-width: 600px) {
          label {
            padding: 10px 0;
            font-size: 1.2rem;
            line-height: 1.6rem;
          }
        }
      `}</style>
    </>
  );
};

export default QuestionBlock;
