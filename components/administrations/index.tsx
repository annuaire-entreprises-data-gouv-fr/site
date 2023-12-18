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
    title="Institut National de la Propriété Industrielle"
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

export const MTPEI = ({ queryString = '' }) => (
  <a
    href={`/administration/mtpei${queryString}`}
    title="Ministère du Travail de l’Emploi et de l’Insertion"
  >
    Ministère du Travail de l’Emploi et de l’Insertion
  </a>
);

export const MI = ({ queryString = '' }) => (
  <a href={`/administration/mi${queryString}`} title="Ministère de l’Intérieur">
    Ministère de l’Intérieur
  </a>
);

export const MEF = ({ queryString = '' }) => (
  <a
    href={`/administration/mef${queryString}`}
    title="Ministère de l’Économie et des Finances"
  >
    Ministère de l’Économie et des Finances
  </a>
);

export const MC = ({ queryString = '' }) => (
  <a href={`/administration/mc${queryString}`} title="Ministère de la Culture">
    Ministère de la Culture
  </a>
);

export const EDUCNAT = ({ queryString = '' }) => (
  <a
    href={`/administration/education-nationale${queryString}`}
    title="Éducation nationale"
  >
    Éducation nationale
  </a>
);
