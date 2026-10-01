export interface GeoResponse {
  centre: {
    type: "Point";
    coordinates: [number, number];
  };
  code: string;
  codesPostaux: string[];
  contour: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  departement: {
    code: string;
    nom: string;
  };
  epci: {
    code: string;
    nom: string;
  };
  mairie: {
    type: "Point";
    coordinates: [number, number];
  };
  nom: string;
  population: number;
  region: {
    code: string;
    nom: string;
  };
  siren: string;
  surface: number;
  type: string;
}

export type IGeoCommune = GeoResponse;
