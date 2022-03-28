import React from 'react';
import { IUniteLegale } from '../../models';
import {
  getNameFromSession,
  ISession,
} from '../../utils/session/accessSession';
import BreadCrumb, { IBreadcrumbLink } from '../bread-crumb';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession;
  links: IBreadcrumbLink[];
}

const SubHeader: React.FC<IProps> = ({ uniteLegale, session, links }) => (
  <div className="sub-header">
    <BreadCrumb links={links} />
    <h1>{uniteLegale.nomComplet} : espace dirigeant(e)</h1>
    <style jsx>{`
      .sub-header {
        position: relative;
        display: block;
        padding-bottom: 20px;
        margin-bottom: 0px;
      }
      .sub-header:before {
        background: #dfdff1;
        height: 2px;
        position: absolute;
        bottom: 0;
        content: '';
        width: 100vw;
        z-index: -1;
        left: calc(-51vw + 50%);
      }
      .sub-header h1 {
        margin: 0;
        font-size: 1.4rem;
        line-height: 2rem;
      }
    `}</style>
  </div>
);

export default SubHeader;
