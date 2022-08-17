/** @ts-ignore */
import dinum from './content/dinum.yml';
/** @ts-ignore */
import inpi from './content/inpi.yml';
/** @ts-ignore */
import insee from './content/insee.yml';
/** @ts-ignore */
import mi from './content/mi.yml';
/** @ts-ignore */
import meti from './content/meti.yml';
/** @ts-ignore */
import dila from './content/dila.yml';
/** @ts-ignore */
import cma from './content/cma.yml';
/* tslint:enable */

export enum EAdministration {
  DINUM = 0,
  INPI = 1,
  INSEE,
  CMAFRANCE,
  DILA,
  METI,
  MI,
}

export const administrationsMetaData: IAdministrationsMetaData = {
  [EAdministration.DINUM]: dinum,
  [EAdministration.INPI]: inpi,
  [EAdministration.INSEE]: insee,
  [EAdministration.DILA]: dila,
  [EAdministration.METI]: meti,
  [EAdministration.MI]: mi,
  [EAdministration.CMAFRANCE]: cma,
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
  apiMonitors: IAPIMonitorMetaData[];
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
    administration.apiMonitors.forEach((monitor) => {
      //@ts-ignore
      acc.push(monitor.id);
    });
    return acc;
  }, []) as number[];
