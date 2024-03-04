import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { IAdministrationMetaData } from '#models/administrations/types';
import constants from '#models/constants';
import InformationTooltip from '.';
import style from './style.module.css';

const DataSourcesTooltip: React.FC<{
  dataSources: IAdministrationMetaData[];
  lastUpdatedAt?: string | Date;
  link: string;
}> = ({ dataSources, lastUpdatedAt, link }) => (
  <>
    <InformationTooltip
      tabIndex={undefined}
      orientation="center"
      label={
        <>
          {dataSources.map((dataSource) => (
            <React.Fragment key={dataSource.long}>
              <div>{dataSource.long}.</div>
            </React.Fragment>
          ))}
        </>
      }
    >
      <a
        href={link}
        className={`no-style-link ${style['data-source']}`}
        style={{
          color: constants.colors.frBlue,
          backgroundColor: constants.colors.pastelBlue,
        }}
      >
        <span className="layout-center">
          <Icon color={constants.colors.frBlue} size={12} slug="information" />
        </span>
        <span>
          &nbsp;Source{dataSources.length > 1 ? 's' : ''}&nbsp;:&nbsp;
          {dataSources.map((dataSource) => dataSource.short).join(', ')}
          {lastUpdatedAt ? (
            <>
              &nbsp;・&nbsp;mise&nbsp;à&nbsp;jour&nbsp;le&nbsp;{lastUpdatedAt}
            </>
          ) : (
            ''
          )}
        </span>
      </a>
    </InformationTooltip>
  </>
);

export default DataSourcesTooltip;
