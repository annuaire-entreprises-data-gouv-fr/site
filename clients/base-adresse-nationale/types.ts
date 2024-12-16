export type IBANResponse = {
  features: {
    geometry: {
      coordinates: number[];
    };
    properties: { label: string };
  }[];
};
