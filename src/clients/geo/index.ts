export interface IGeoElement {
  label: string;
  type: "insee" | "cp" | "dep" | "reg" | "epci";
  value: string;
}
