import { useCallback, useId, useState } from "react";
import routes from "#/clients/routes";
import { Link } from "#/components/link";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";
import { DataSection } from "#/components/section/data-section";
import { FullTable } from "#/components/table/full";
import ButtonLink from "#/components-ui/button";
import FAQLink from "#/components-ui/faq-link";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import type { IRGECertification } from "#/models/certifications/rge";
import { formatSiret, pluralize } from "#/utils/helpers";

const ETABLISSEMENTS_PER_PAGE = 10;

const renovLink = (slug: string) => {
  try {
    return `${routes.certifications.rge.site}/identifier?company=${slug}&date=${
      new Date().toISOString().split("T")[0]
    }`;
  } catch {
    return "";
  }
};

const EtablissementRGE = ({
  etablissement,
}: {
  etablissement: IRGECertification["etablissements"][number];
}) => {
  const { certifications, companyInfo } = etablissement;
  const { siret } = companyInfo;
  const linkFranceRenov = renovLink(siret);

  return (
    <div className="fr-mb-4w">
      <div
        className="layout-left fr-mb-3w"
        style={{ alignItems: "baseline", justifyContent: "space-between" }}
      >
        <h3 className="fr-mb-0 fr-mr-2w">
          SIRET&nbsp;:{" "}
          <Link params={{ slug: siret }} to="/etablissement/$slug">
            {formatSiret(siret)}
          </Link>
        </h3>
        {linkFranceRenov && (
          <a href={linkFranceRenov} rel="noreferrer noopener" target="_blank">
            Consulter cet établissement sur le site France Rénov’.
          </a>
        )}
      </div>
      <FullTable
        body={certifications.map((certification) => [
          <div className="layout-left font-small">
            {certification.logoPath && (
              <div style={{ width: 72 }}>
                <img
                  alt={`Logo ${certification.nomCertificat}`}
                  height="100%"
                  src={certification.logoPath}
                  title={`Logo ${certification.nomCertificat}`}
                  width="100%"
                />
              </div>
            )}
            <div> {certification.nomCertificat}</div>
          </div>,
          <ul>
            {certification.domaines.map((domaine) => (
              <li className="font-small" key={domaine}>
                {domaine}
              </li>
            ))}
          </ul>,
          <ButtonLink
            alt
            small
            target="_blank"
            to={certification.urlQualification}
          >
            ⇢&nbsp;Consulter
          </ButtonLink>,
        ])}
        columnWidths={["300px", "1fr", "140px"]}
        head={["Certificat", "Domaine(s) certifié(s)", "Lien"]}
      />
    </div>
  );
};

const RGEContent = ({
  certificationsRGE,
}: {
  certificationsRGE: IRGECertification;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const id = useId();
  const { etablissements } = certificationsRGE;
  const totalCertifications = etablissements.reduce(
    (total, etablissement) => total + etablissement.certifications.length,
    0
  );
  const totalPages = Math.ceil(etablissements.length / ETABLISSEMENTS_PER_PAGE);
  const start = (currentPage - 1) * ETABLISSEMENTS_PER_PAGE;
  const etablissementsDeLaPage = etablissements.slice(
    start,
    start + ETABLISSEMENTS_PER_PAGE
  );

  const onChangePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    [id]
  );

  return (
    <div id={id}>
      Cette structure est une entreprise{" "}
      <FAQLink
        to="/faq/reconnu-garant-environnement"
        tooltipLabel="certifiée RGE - Reconnu Garant de l’Environnement"
      >
        La certification RGE est accordée par les pouvoirs publics aux
        professionnels du bâtiment spécialisés dans les travaux de rénovation
        énergétique.
      </FAQLink>
      .
      <p>
        Cette structure possède <strong>{totalCertifications}</strong>{" "}
        certificat{totalCertifications > 1 ? "s" : ""} réparti
        {totalCertifications > 1 ? "s" : ""} dans{" "}
        <strong>{etablissements.length}</strong> établissement
        {pluralize(etablissements)}&nbsp;:
      </p>
      {etablissementsDeLaPage.map((etablissement) => (
        <EtablissementRGE
          etablissement={etablissement}
          key={etablissement.companyInfo.siret}
        />
      ))}
      <LocalPageCounter
        compact={true}
        currentPage={currentPage}
        onPageChange={onChangePage}
        totalPages={totalPages}
      />
    </div>
  );
};

export const CertificationsRGESection: React.FC<{
  certificationsRGE: IRGECertification | IAPINotRespondingError;
}> = ({ certificationsRGE }) => (
  <DataSection
    data={certificationsRGE}
    id="rge"
    notFoundInfo={
      <p>
        Nous n’avons pas retrouvé les certifications RGE de cette entreprise
        dans l’annuaire des professionnels qualifiés. En revanche, vous pouvez
        peut-être les retrouver grâce au{" "}
        <a href={routes.certifications.rge.site}>
          moteur de recherche France Renov Officiel
        </a>
        .
      </p>
    }
    sources={[EAdministration.ADEME]}
    title="RGE - Reconnu Garant de l'Environnement"
  >
    {(certificationsRGE) => (
      <RGEContent certificationsRGE={certificationsRGE} />
    )}
  </DataSection>
);
