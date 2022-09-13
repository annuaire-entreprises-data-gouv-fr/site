/** @ts-ignore */
import dinum from '../../data/administrations/dinum.yml';
/** @ts-ignore */
import inpi from '../../data/administrations/inpi.yml';
/** @ts-ignore */
import insee from '../../data/administrations/insee.yml';
/** @ts-ignore */
import mi from '../../data/administrations/mi.yml';
/** @ts-ignore */
import meti from '../../data/administrations/meti.yml';
/** @ts-ignore */
import dila from '../../data/administrations/dila.yml';
/** @ts-ignore */
import cma from '../../data/administrations/cma.yml';
/** @ts-ignore */
import vies from '../../data/administrations/vies.yml';
/* tslint:enable */

export enum EAdministration {
  DINUM = 'dinum',
  INPI = 'inpi',
  INSEE = 'insee',
  CMAFRANCE = 'cma',
  DILA = 'dila',
  METI = 'meti',
  MI = 'mi',
  VIES = 'vies',
}

export const administrationsMetaData: IAdministrationsMetaData = {
  [EAdministration.DINUM]: dinum,
  [EAdministration.INPI]: inpi,
  [EAdministration.INSEE]: insee,
  [EAdministration.DILA]: dila,
  [EAdministration.METI]: meti,
  [EAdministration.MI]: mi,
  [EAdministration.CMAFRANCE]: cma,
  [EAdministration.VIES]: vies,
};

export interface IAdministrationsMetaData {
  [key: string]: IAdministrationMetaData;
}
export interface IAdministrationMetaData {
  long: string;
  short: string;
  logo?: JSX.Element;
  slug: string;
  description: string;
  contact: string;
  site?: string;
  apiMonitors?: IAPIMonitorMetaData[];
  dataGouvLink?: string;
  data?: string[];
}

export interface IAPIMonitorMetaData {
  id: number;
  apiGouvLink?: string;
  dataGouvLink?: string;
  apiName: string;
  data: string[];
}

export const allMonitoringIds = () =>
  Object.values(administrationsMetaData).reduce((acc, administration) => {
    (administration.apiMonitors || []).forEach((monitor) => {
      //@ts-ignore
      acc.push(monitor.id);
    });
    return acc;
  }, []) as number[];
