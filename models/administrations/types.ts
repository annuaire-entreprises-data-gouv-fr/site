import { EAdministration } from './EAdministration';

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
  estServicePublic: boolean;
  dataSources: {
    label: string;
    datagouvLink: string;
    apiSlug: string;
    data?: {
      label: string;
      form?: string;
      targets?: string[];
    }[];
  }[];
};

export type IAPIMonitorMetaData = {
  updownIoId: string;
  apigouvLink?: string;
  apiSlug: string;
  apiName: string;
};
