export interface IDVFItem {
  a: number | null; // Nombre de ventes d’appartements.
  am: number | null; // Nombre de ventes d’appartements et de maisons.
  c: string; // Code INSEE de la commune.
  d: string; // Mois concerné, au format YYYY-MM.
  l: string; // Niveau géographique de la ligne.
  m: number | null; // Nombre de ventes de maisons.
  m_a: number | null; // Prix médian au m² des appartements.
  m_am: number | null; // Prix médian au m² des appartements et des maisons.
  m_l: number | null; // Prix médian au m² des locaux industriels et commerciaux.
  m_m: number | null; // Prix médian au m² des maisons.
  n: string; // Nom du territoire.
  p: string | null; // Code du parent : SIREN de l’EPCI.
}

export interface IDVFResponse {
  data: IDVFItem[];
}
