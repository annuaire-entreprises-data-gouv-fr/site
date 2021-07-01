export const INSEE = ({ queryString = '' }) => (
  <a rel="nofollow" href={`/administration/inpi${queryString}`}>
    INPI
  </a>
);

export const INPI = ({ queryString = '' }) => (
  <a rel="nofollow" href={`/administration/insee${queryString}`}>
    INSEE
  </a>
);

export const DILA = ({ queryString = '' }) => (
  <a rel="nofollow" href={`/administration/dila${queryString}`}>
    DILA
  </a>
);

export const METI = ({ queryString = '' }) => (
  <a rel="nofollow" href={`/administration/meti${queryString}`}>
    Ministère du Travail
  </a>
);

export const CMA = ({ queryString = '' }) => (
  <a rel="nofollow" href={`/administration/cma-france${queryString}`}>
    CMA-France
  </a>
);
