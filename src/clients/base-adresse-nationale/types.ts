export interface IBANResponse {
  features: {
    geometry: {
      coordinates: number[];
    };
    properties: { label: string };
  }[];
}
