import React from 'react';
import Page from '.';
import { ISession } from '../utils/session/accessSession';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  session?: ISession | null;
  img: JSX.Element;
}

const PageConnexion: React.FC<IProps> = ({
  children,
  title,
  description,
  canonical,
  noIndex = false,
  img,
  session = null,
}) => (
  <Page
    title={title}
    noIndex={noIndex}
    canonical={canonical}
    description={description}
    session={session}
  >
    <div className="connect-container">
      <div className="img-container">
        <div>{img}</div>
      </div>
      <div className="body">{children}</div>
      <style jsx>{`
        .connect-container {
          display: flex;
          position: relative;
          align-items: stretch;
          min-height: 450px;
        }
        .connect-container > div {
          padding: 30px;
          width: 50%;
        }

        .img-container:before {
          background-color: #f5f5fe;
          border-radius: 4px;
          position: absolute;
          top: 0;
          bottom: 0;
          content: '';
          width: 50vw;
          z-index: -1;
          left: calc(-51vw + 50%);
        }
        .img-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: inherit 100px;
        }
        .img-container > div {
          max-width: 400px;
        }
        div.body {
          margin-bottom: 100px;
        }

        @media only screen and (min-width: 1px) and (max-width: 699px) {
          .connect-container {
            display: flex;
            flex-direction: column-reverse;
          }
          .connect-container > div {
            padding: 0;
            width: 100%;
          }

          .img-container:before {
            display: none;
          }
          div.body {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  </Page>
);

export default PageConnexion;
