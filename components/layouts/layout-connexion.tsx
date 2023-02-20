import React, { PropsWithChildren } from 'react';
import Footer from '#components/footer';
import { Header } from '#components/header';
import constants from '#models/constants';

interface IProps {
  img: JSX.Element;
}

export const LayoutConnexion: React.FC<PropsWithChildren<IProps>> = ({
  children,
  img,
}) => (
  <div id="page-layout">
    <Header
      useSearchBar={false}
      useLogo={true}
      useAdvancedSearch={false}
      useMap={false}
    />
    <div className="connect-container">
      <div className="img-container">
        <div>{img}</div>
      </div>
      <div className="body">{children}</div>
      <style jsx>{`
        .connect-container {
          display: flex;
          position: relative;
          align-items: center;
          justify-content: center;
          margin: 50px 0;
        }

        .connect-container > div {
          padding: 0 40px;
          width: 50%;
        }

        .img-container:before {
          background-color: #f5f5fe;
          border-radius: 8px;
          position: absolute;
          top: 0;
          bottom: 0;
          content: '';
          width: 55vw;
          z-index: -1;
          left: calc(-51vw + 50%);
        }
        .img-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 450px;
          padding: inherit 100px;
        }
        .img-container > div {
          max-width: 400px;
        }
        div.body {
          margin: 30px 0;
          margin-left: -80px;
          border-radius: 8px;
          background-color: #fff;
        }

        @media only screen and (min-width: 1px) and (max-width: 768px) {
          .img-container {
            display: none;
          }
          div.body {
            margin: 0;
          }
          .connect-container > div {
            padding: 40px;
            padding-top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  </div>
);
