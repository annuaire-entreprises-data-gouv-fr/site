import React from 'react';
import Page from '.';
import { ISession } from '../utils/session/accessSession';

interface IProps {
  title: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  session?: ISession | null;
  img: string;
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
      {img && (
        <div className="img-container">
          <img src={img} />
        </div>
      )}
      <div className="body">{children}</div>
      <style jsx>{`
        .connect-container {
          display: flex;
          position: relative;
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
        }
        img {
          width: 80%;
        }
      `}</style>
    </div>
  </Page>
);

export default PageConnexion;
