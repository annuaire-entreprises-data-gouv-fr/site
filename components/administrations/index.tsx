export const INSEE = ({ queryString = '' }) => (
  <a
    href={`/administration/insee${queryString}`}
    title="Institut National de la Statistique et des Études Économiques"
  >
    Insee
  </a>
);

export const ADEME = ({ queryString = '' }) => (
  <a
    href={`/administration/ademe${queryString}`}
    title="ADEME - Agence de la transition écologique "
  >
    ADEME
  </a>
);

export const INPI = ({ queryString = '' }) => (
  <a
    href={`/administration/inpi${queryString}`}
    title="Institut National de la Propriété Intellectuelle"
  >
    INPI
  </a>
);

export const DILA = ({ queryString = '' }) => (
  <a
    href={`/administration/dila${queryString}`}
    title="Direction de l’Information Légale et Administrative"
  >
    DILA
  </a>
);

export const METI = ({ queryString = '' }) => (
  <a
    href={`/administration/meti${queryString}`}
    title="Ministère du Travail de l’Emploi et de l’Insertion"
  >
    Ministère du Travail
  </a>
);

export const MI = ({ queryString = '' }) => (
  <a href={`/administration/mi${queryString}`} title="Ministère de l’Intérieur">
    Ministère de l’Intérieur
  </a>
);

export const CMA = ({ queryString = '' }) => (
  <a
    href={`/administration/cma-france${queryString}`}
    title="Chambre des Métiers et de l’Artisanat"
  >
    CMA-France
  </a>
);
