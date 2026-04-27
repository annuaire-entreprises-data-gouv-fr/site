import type { EAdministration } from "./EAdministration";

export interface IAdministrationsMetaData {
  [key: string]: IAdministrationMetaData;
}
export interface IAdministrationMetaData {
  administrationEnum: EAdministration;
  apiMonitors?: IAPIMonitorMetaData[];
  contact: string;
  dataSources: {
    label: string;
    datagouvLink: string;
    apiSlug: string;
    isProtected?: boolean;
    data?: {
      label: string;
      form?: string;
      targets?: string[];
    }[];
  }[];
  description: string;
  estServicePublic: boolean;
  logoType: "portrait" | "paysage" | null;
  long: string;
  short: string;
  site: string;
  slug: string;
}

export interface IAPIMonitorMetaData {
  apiDocumentationLink?: string;
  apiName: string;
  apiSlug: string;
  isProtected?: boolean;
  startDate?: number;
  updownIoId: string;
}
