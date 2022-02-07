import React from 'react';
import { IUniteLegale } from '../../models';
import {
  getNameFromSession,
  ISession,
} from '../../utils/session/manageSession';
import BreadCrumb, { IBreadcrumbLink } from '../bread-crumb';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession;
  links: IBreadcrumbLink[];
}

const SubHeader: React.FC<IProps> = ({ uniteLegale, session, links }) => (
  <div className="sub-header">
    <BreadCrumb links={links} />
    <h1>Bonjour {getNameFromSession(session)}</h1>
    <div>
      Vous êtes présidente de <b>{uniteLegale.nomComplet}</b>, bienvenue sur la
      fiche de votre entreprise :
    </div>
    <style jsx>{`
      .sub-header {
        position: relative;
        display: block;
        margin-bottom: 25px;
      }
      .sub-header:before {
        background: #f5f5fe;
        border-radius: 4px;
        position: absolute;
        top: 0;
        bottom: 0;
        content: '';
        width: 100vw;
        z-index: -1;
        left: calc(-51vw + 50%);
      }
      .sub-header h1 {
        margin: 0 0;
        font-size: 1.6rem;
        line-height: 2rem;
      }
      .sub-header > div {
        padding: 10px 0 30px;
        font-size: 1rem;
        line-height: 1.3rem;
      }
    `}</style>
  </div>
);

export default SubHeader;
