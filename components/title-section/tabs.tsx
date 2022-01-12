import React from 'react';

import { FICHE, menu } from '.';
import { PrintNever } from '../print-visibility';

export const Tabs: React.FC<{
  ficheType: FICHE;
  siren: string;
  estDirigeant: boolean;
}> = ({ ficheType, siren, estDirigeant = false }) => (
  <PrintNever>
    <div className="title-tabs">
      {menu
        .filter((menuItem) => !menuItem.private)
        .map((menuItem) => (
          <a
            key={menuItem.title}
            className={`${ficheType === menuItem.type && 'active'}`}
            href={menuItem.path(siren)}
          >
            {menuItem.title}
          </a>
        ))}
    </div>

    <style jsx>{`
      .title-tabs {
        display: flex;
        flex-grow: 1;
        font-size: 0.9rem;
        border-bottom: 2px solid #dfdff1;
        margin-bottom: 40px;
      }
      .title-tabs > a {
        color: #000091;
        font-weight: bold;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        margin: 0 4px;
        padding: 10px 5px;
        border: 2px solid #dfdff1;
        background-color: #efeffb;
        margin-bottom: -2px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: 'left';
        box-shadow: 0 -8px 5px -5px #dfdff1 inset;
      }

      .title-tabs > a:hover {
        background-color: #dfdff1;
      }

      .title-tabs > a.active {
        background-color: #fff;
        border-bottom: 0;
        box-shadow: none;
      }

      @media only screen and (min-width: 1px) and (max-width: 450px) {
        .title-tabs {
          flex-direction: column;
          border-bottom: 0;
        }
        .title-tabs > a {
          margin: 3px;
        }
        .title-tabs > a.active {
          background-color: #fff;
          border-bottom: 2px solid #dfdff1;
          box-shadow: none;
        }
      }
    `}</style>
  </PrintNever>
);

export default Tabs;
