import React from 'react';
import {
  getNameFromSession,
  ISession,
} from '../../utils/session/manageSession';

const UserMenu: React.FC<{ session: ISession }> = ({ session }) => (
  <div className="user-menu-container">
    <div className="fr-link fr-fi-account-fill">
      {getNameFromSession(session)}
    </div>
    <div className="user-menu">
      <ul>
        <li>
          <a href="/">Ganymede</a>
        </li>
      </ul>
      <div className="separator" />
      <div>
        <a href="/api/account/logout">Me déconnecter</a>
      </div>
    </div>
    <style jsx>{`
      .user-menu-container {
        position: relative;
      }
      .user-menu-container:hover > .user-menu {
        display: block;
      }
      .user-menu {
        display: none;
        width:200px;
        background-color: #fff;
        position: absolute;
        right:0;
        box-shadow: 0 0 8px -2px rgba(0, 0, 0, 0.3);
        padding:0;
        border-radius: 4px;
        text-align: left;
        z-index: 100;
      }

      .user-menu:before {

      }

      .user-menu > div,
      .user-menu > ul > li {
        padding: 10px;
      }
      .user-menu .separator {
        width: 100%;
        height: 1px;
        background-color: #ccc;
      }
    `}</style>
  </div>
);

export default UserMenu;
