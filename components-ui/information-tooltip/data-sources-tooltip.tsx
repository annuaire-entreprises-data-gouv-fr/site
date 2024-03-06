import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { IAdministrationMetaData } from '#models/administrations/types';
import constants from '#models/constants';
import InformationTooltip from '.';
import style from './style.module.css';

const DataSourcesTooltip: React.FC<{
  dataSources: IAdministrationMetaData[];
  lastUpdatedAt?: string;
  link: string;
  orientation?: 'center' | 'left' | 'right';
}> = ({ dataSources, lastUpdatedAt, link, orientation }) => (
  <>
    {lastUpdatedAt ? (
      <>
        <span className={style['updated-at']}>
          Mise à jour le {lastUpdatedAt}
        </span>
        <br />
      </>
    ) : (
      ''
    )}
    <InformationTooltip
      tabIndex={undefined}
      orientation={orientation || 'center'}
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
        }}
      >
        <span
          className="layout-center"
          style={{ display: 'inlineBloc', marginRight: '0.25rem' }}
        >
          <Icon color={constants.colors.frBlue} size={12} slug="information" />
        </span>
        <span>
          Source{dataSources.length > 1 ? 's' : ''}&nbsp;:&nbsp;
          {dataSources.map((dataSource) => dataSource.short).join(', ')}
        </span>
      </a>
    </InformationTooltip>
  </>
);

export default DataSourcesTooltip;
