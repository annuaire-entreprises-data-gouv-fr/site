export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

declare global {
  interface Window {
    _paq: any[];
  }
}
