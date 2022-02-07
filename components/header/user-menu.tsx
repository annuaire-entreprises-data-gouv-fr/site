import React from 'react';
import {
  getCompaniesFromSession,
  getNameFromSession,
  ISession,
} from '../../utils/session/manageSession';

const UserMenu: React.FC<{ session: ISession }> = ({ session }) => {
  const companies = getCompaniesFromSession(session);
  return (
    <div className="user-menu-container">
      <div className="fr-link fr-fi-account-fill">
        {getNameFromSession(session)}
      </div>
      <div className="user-menu">
        {companies.length > 0 && (
          <ul>
            <label className="menu-label">mes entreprises :</label>
            {getCompaniesFromSession(session).map((company) => (
              <li key={company.siren}>
                <a href={`/compte/${company.siren}`}>・{company.siren}</a>
              </li>
            ))}
          </ul>
        )}
        <div>
          <a href="/api/account/logout">Me déconnecter</a>
        </div>
      </div>
      <style jsx>{`
        .user-menu-container {
          position: relative;
          font-size: 0.9rem;
          color: #000091;
        }
        .user-menu-container > div:first-of-type {
          cursor: pointer;
        }

        .user-menu-container:hover > .user-menu {
          display: block;
        }
        .user-menu {
          display: none;
          width: 270px;
          background-color: #fff;
          position: absolute;
          right: 0;
          box-shadow: 0 0 12px 0px rgba(0, 0, 0, 0.15);
          padding: 0;
          border-radius: 7px;
          text-align: left;
          z-index: 100;
          padding: 7px 0;
        }

        .user-menu:before {
          content: '';
          height: 10px;
          width: 10px;
          display: block;
          position: absolute;
          background: #fff;
          transform: rotate(45deg);
          right: 40px;
          top: -5px;
        }

        .user-menu label.menu-label {
          font-variant: small-caps;
          font-weight: 600;
          color: #555;
          padding: 0 10px;
          font-size: 0.8rem;
        }

        .user-menu a {
          display: block;
          padding: 6px 10px;
        }
        .user-menu a:hover {
          background: #efefef;
        }
        .user-menu > ul {
          border-bottom: 1px solid #efefef;
        }

        .user-menu .separator {
          width: 100%;
          background-color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
