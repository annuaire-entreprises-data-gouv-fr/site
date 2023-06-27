import { EAdministration } from '.';

export type IAdministrationsMetaData = {
  [key: string]: IAdministrationMetaData;
};
export type IAdministrationMetaData = {
  long: string;
  short: string;
  logoType: 'portrait' | 'paysage' | null;
  administrationEnum: EAdministration;
  slug: string;
  description: string;
  contact: string;
  site: string;
  apiMonitors?: IAPIMonitorMetaData[];
  dataSources: {
    label: string;
    datagouvLink: string;
    modifyDataSourceLink: string;
    apiSlug: string;
    keywords: string;
  }[];
};

export type IAPIMonitorMetaData = {
  id: number;
  apigouvLink?: string;
  apiSlug: string;
  apiName: string;
};
