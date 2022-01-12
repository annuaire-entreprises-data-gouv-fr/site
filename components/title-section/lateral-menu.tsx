import React from 'react';

import { FICHE, menu } from '.';
import { PrintNever } from '../print-visibility';

export const LateralMenu: React.FC<{
  ficheType: FICHE;
  siren: string;
  estDirigeant: boolean;
}> = ({ ficheType, siren }) => (
  <PrintNever>
    <div className="menu">
      <div className="lateral-menu">
        <div>
          <div className="menu-label">pages privées</div>
          {menu
            .filter((menuItem) => menuItem.private)
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
        <div>
          <div className="menu-label">pages publiques</div>
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
      </div>
    </div>

    <style jsx>{`
      .menu {
        width: 240px;
        flex-shrink: 0;
        background-color: #fff;
        border-right: 1px solid #dfdff1;
        box-shadow: 12px 0 10px -10px #dfdff1;
        margin-right: 30px;
        padding: 0;
        height: 100vh;
        position: sticky;
        top: 0;
      }
      .lateral-menu {
        display: flex;
        flex-grow: 1;
        font-size: 0.9rem;
        flex-direction: column;
        border-bottom: none;
        margin: 0;
      }
      .lateral-menu > div > a {
        color: #000091;
        font-weight: bold;
        padding: 5px 5px;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 3px;
        border: none;
        padding-left: 10px;
        margin: 3px 20px 3px 0;
        text-align: left;
        justify-content: start;
        box-shadow: none;
        border: 1px solid transparent;
      }

      .lateral-menu > div > a:hover {
        background-color: #efeffb;
      }

      .lateral-menu > div > a.active {
        background-color: #dfdff1;
        border-bottom: 0;
        box-shadow: none;
      }

      .menu-label {
        margin-top: 10px;
        font-variant: small-caps;
        font-size: 0.9rem;
      }

      @media only screen and (min-width: 1px) and (max-width: 450px) {
        .lateral-menu {
          flex-direction: column;
          border-bottom: 0;
        }
        .lateral-menu > div > a {
          margin: 3px;
        }
        .lateral-menu > div > a.active {
          background-color: #fff;
          border-bottom: 2px solid #dfdff1;
          box-shadow: none;
        }
      }
    `}</style>
  </PrintNever>
);

export default LateralMenu;
