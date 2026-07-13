export interface IFondationResponse {
  accountDepositYears: unknown[];
  accountMissingYears: unknown[];
  address: {
    oneLine: string;
    coordinates: [number, number];
    dsAddress: {
      label: string;
      type: string;
      streetAddress: string;
      streetNumber: string;
      streetName: string;
      countryCode: string;
      countryName: string;
      postalCode: string;
      cityName: string;
      cityCode: string;
      departmentName: string;
      departmentCode: string;
      regionName: string;
      regionCode: string;
    };
  };
  createdAt: string | null;
  creationAt: string;
  department: string;
  dueDate: string | null;
  email: string | null;
  files: unknown[];
  fiscalEndAt: string | null;
  foreignFinancingYears: unknown[];
  foundationType: string;
  fromLineage: {
    organismes: [
      {
        kind: string;
        publicId: string;
      },
    ];
    type: string;
    at: string;
  } | null;
  generalInterestDomain: string;
  hasInternationalActivity: boolean;
  hub_timestamp: string | null;
  id: string;
  isAccountLate: boolean;
  isPersonDataPrivate: boolean;
  persons: unknown[];
  phone: string | null;
  publicGenerosityYears: unknown[];
  publicSubsidyYears: unknown[];
  siret: string | null;
  socialObject: string;
  state: string;
  stateEffectiveAt: string;
  title: string;
  toLineage: {
    organismes: [
      {
        kind: string;
        publicId: string;
      },
    ];
    type: string;
    at: string;
  } | null;
  updatedAt: string | null;
  website: string | null;
}

export interface IFondation {
  address: {
    oneLine: string;
    coordinates: [number, number];
    dsAddress: {
      label: string;
      type: string;
      streetAddress: string;
      streetNumber: string;
      streetName: string;
      countryCode: string;
      countryName: string;
      postalCode: string;
      cityName: string;
      cityCode: string;
      departmentName: string;
      departmentCode: string;
      regionName: string;
      regionCode: string;
    };
  };
  creationAt: string;
  department: string;
  foundationType: string;
  generalInterestDomain: string;
  hasInternationalActivity: boolean;
  id: string;
  siret: string | null;
  socialObject: string;
  state: string;
  stateEffectiveAt: string;
  title: string;
}
