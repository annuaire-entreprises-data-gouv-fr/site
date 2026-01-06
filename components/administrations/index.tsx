import { Link } from "#components/Link";

export const INSEE = ({ queryString = "" }) => (
  <Link
    href={`/administration/insee${queryString}`}
    title="Institut National de la Statistique et des Études Économiques"
  >
    Insee
  </Link>
);

export const ADEME = ({ queryString = "" }) => (
  <Link
    href={`/administration/ademe${queryString}`}
    title="ADEME - Agence de la transition écologique "
  >
    ADEME
  </Link>
);

export const INPI = ({ queryString = "" }) => (
  <Link
    href={`/administration/inpi${queryString}`}
    title="Institut National de la Propriété Industrielle"
  >
    INPI
  </Link>
);

export const ESSFrance = ({ queryString = "" }) => (
  <Link
    href={`/administration/ess-france${queryString}`}
    title="ESS France ou Chambre Française de l'Economie Sociale et Solidaire"
  >
    ESS France
  </Link>
);

export const DILA = ({ queryString = "" }) => (
  <Link
    href={`/administration/dila${queryString}`}
    title="Direction de l’Information Légale et Administrative"
  >
    DILA
  </Link>
);

export const MTPEI = ({ queryString = "" }) => (
  <Link
    href={`/administration/mtpei${queryString}`}
    title="Ministère du Travail de l’Emploi et de l’Insertion"
  >
    ministère du Travail de l’Emploi et de l’Insertion
  </Link>
);

export const MI = ({ queryString = "" }) => (
  <Link
    href={`/administration/mi${queryString}`}
    title="Ministère de l’Intérieur"
  >
    ministère de l’Intérieur
  </Link>
);

export const MSS = ({ queryString = "" }) => (
  <Link
    href={`/administration/mss${queryString}`}
    title="Ministère des Solidarités et de la Santé"
  >
    ministère des Solidarités et de la Santé
  </Link>
);

export const DJEPVA = ({ queryString = "" }) => (
  <Link
    href={`/administration/djepva${queryString}`}
    title="Direction de la Jeunesse de l’Éducation Populaire et de la Vie Associative"
  >
    Direction de la Jeunesse de l’Éducation Populaire et de la Vie Associative
  </Link>
);

export const DataSubvention = ({ queryString = "" }) => (
  <Link
    href={`/administration/data-subvention${queryString}`}
    title="Data Subvention"
  >
    Data Subvention
  </Link>
);

export const MEF = ({ queryString = "" }) => (
  <Link
    href={`/administration/mef${queryString}`}
    title="Ministère de l’Économie et des Finances"
  >
    ministère de l’Économie et des Finances
  </Link>
);

export const MC = ({ queryString = "" }) => (
  <Link
    href={`/administration/mc${queryString}`}
    title="Ministère de la Culture"
  >
    ministère de la Culture
  </Link>
);

export const EDUCNAT = ({ queryString = "" }) => (
  <Link
    href={`/administration/education-nationale${queryString}`}
    title="Éducation nationale"
  >
    éducation nationale
  </Link>
);

export const DINUM = ({ queryString = "" }) => (
  <Link
    href={`/administration/dinum${queryString}`}
    title="Direction Interministérielle du Numérique"
  >
    DINUM
  </Link>
);

export const MarcheInclusion = ({ queryString = "" }) => (
  <Link
    href={`/administration/marche-inclusion${queryString}`}
    title="Le Marché de l’Inclusion"
  >
    Marché de l’Inclusion
  </Link>
);

export const GIPMDS = ({ queryString = "" }) => (
  <Link
    href={`/administration/gip-mds${queryString}`}
    title="Groupement d’intérêt public Modernisation des déclarations sociales"
  >
    GIP MDS
  </Link>
);

export const DGFiP = ({ queryString = "" }) => (
  <Link
    href={`/administration/dgfip${queryString}`}
    title="Direction générale des Finances publiques"
  >
    DGFiP
  </Link>
);

export const CNIL = ({ queryString = "" }) => (
  <Link
    href={`/administration/cnil${queryString}`}
    title="Commission Nationale de l'Informatique et des Libertés"
  >
    CNIL
  </Link>
);
