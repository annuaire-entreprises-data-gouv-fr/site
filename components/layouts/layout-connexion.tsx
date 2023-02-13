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
          align-items: stretch;
          min-height: 450px;
          border-top: 2px solid ${constants.colors.frBlue};
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

        @media only screen and (min-width: 1px) and (max-width: 768px) {
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
    <Footer />
  </div>
);
