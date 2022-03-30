import React from 'react';

import { FICHE, menu } from '.';
import { PrintNever } from '../print-visibility';

export const LateralMenu: React.FC<{
  ficheType: FICHE;
  siren: string;
  estDirigeant: boolean;
}> = ({ ficheType, siren }) => (
  <PrintNever>
    <nav className="fr-sidemenu menu" aria-label="Menu latéral">
      <div className="fr-sidemenu__inner lateral-menu">
        <div className="fr-collapse" id="fr-sidemenu-wrapper">
          <ul className="fr-sidemenu__list">
            {menu.map((menuItem) => (
              <li
                key={menuItem.title}
                className={`fr-sidemenu__item ${
                  ficheType === menuItem.type && 'fr-sidemenu__item--active'
                }`}
              >
                <a
                  className="fr-sidemenu__link"
                  target="_self"
                  aria-current="page"
                  href={menuItem.path(siren)}
                >
                  {menuItem.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
    <style jsx>{`
      .menu {
        width: 220px;
        flex-shrink: 0;
        background-color: #fff;
        border-right: 1px solid #dfdff1;
        box-shadow: 12px 0 10px -10px #dfdff1;
        margin: 0 30px 0 0;
        padding: 20px 0 0;
        height: 100vh;
        position: sticky;
        top: 0;
      }
      .lateral-menu,
      .fr-sidemenu__link {
        margin-right: 0 !important;
        margin-left: 0 !important;
        padding-right: 5px !important;
        padding-left: 5px !important;
      }

      @media only screen and (min-width: 1px) and (max-width: 991px) {
        nav.fr-sidemenu.menu {
          display: none !important;
        }
      }
    `}</style>
  </PrintNever>
);

export default LateralMenu;
