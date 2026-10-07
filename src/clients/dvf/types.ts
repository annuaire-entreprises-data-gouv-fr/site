export interface IDVFItem {
  a: number | null;
  am: number | null;
  c: string;
  d: string;
  l: string;
  m: number | null;
  m_a: number | null;
  m_am: number | null;
  m_l: number | null;
  m_m: number | null;
  n: string;
  p: string | null;
}

export interface IDVFResponse {
  data: IDVFItem[];
}
