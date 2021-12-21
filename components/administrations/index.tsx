export const INSEE = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/insee${queryString}`}
    title="Institut National de la Statistique et des Études Économiques"
  >
    Insee
  </a>
);

export const INPI = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/inpi${queryString}`}
    title="Institut National de la Propriété Intellectuelle"
  >
    INPI
  </a>
);

export const DILA = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/dila${queryString}`}
    title="Direction de l’Information Légale et Administrative"
  >
    DILA
  </a>
);

export const METI = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/meti${queryString}`}
    title="Ministère du Travail de l’Emploi et de l’Insertion"
  >
    Ministère du Travail
  </a>
);

export const MI = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/mi${queryString}`}
    title="Ministère de l’Intérieur"
  >
    Ministère de l’Intérieur
  </a>
);

export const CMA = ({ queryString = '' }) => (
  <a
    rel="nofollow"
    href={`/administration/cma-france${queryString}`}
    title="Chambre des Métiers et de l’Artisanat"
  >
    CMA-France
  </a>
);
