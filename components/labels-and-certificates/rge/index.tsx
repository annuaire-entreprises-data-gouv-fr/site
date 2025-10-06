import type React from "react";
import routes from "#clients/routes";
import { DataSection } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import { TwoColumnTable } from "#components/table/simple";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { ISession } from "#models/authentication/user/session";
import type { IRGECertification } from "#models/certifications/rge";
import type { IUniteLegale } from "#models/core/types";
import { pluralize } from "#utils/helpers";

const renovLink = (slug: string) => {
  try {
    return `${routes.certifications.rge.site}/identifier?company=${slug}&date=${
      new Date().toISOString().split("T")[0]
    }`;
  } catch {
    return "";
  }
};

export const CertificationsRGESection: React.FC<{
  uniteLegale: IUniteLegale;
  certificationsRGE: IRGECertification | IAPINotRespondingError;
  session: ISession | null;
}> = ({ uniteLegale, certificationsRGE, session }) => (
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
    {(certificationsRGE) => {
      const {
        adresse,
        telephone,
        siret,
        siteInternet,
        email,
        workingWithIndividual,
      } = certificationsRGE.companyInfo;

      const data = [
        ["Dénomination", uniteLegale.nomComplet],
        ["Adresse", adresse],
        [
          "Téléphone",
          telephone && <a href={`tel:${telephone}`}>{telephone}</a>,
        ],
        [
          "Site internet",
          siteInternet && <a href={siteInternet}>{siteInternet}</a>,
        ],
        ["Email", email && <a href={`mailto:${email}`}>{email}</a>],
        [
          "Travaille avec",
          <div>
            <Tag color="info">Professionnels</Tag>
            {workingWithIndividual && <Tag color="info">Particuliers</Tag>}
          </div>,
        ],
      ];

      const plural = pluralize(certificationsRGE.certifications);
      const linkFranceRenov = renovLink(siret);

      return (
        <>
          Cette structure est une entreprise{" "}
          <FAQLink
            to="/faq/reconnu-garant-environnement"
            tooltipLabel="certifiée RGE - Reconnu Garant de l’Environnement"
          >
            La certification RGE est accordée par les pouvoirs publics aux
            professionnels du bâtiment spécialisés dans les travaux
            de rénovation énergétique.
          </FAQLink>
          .
          {linkFranceRenov && (
            <p>
              Vous pouvez consulter{" "}
              <a
                href={linkFranceRenov}
                rel="noreferrer noopener"
                target="_blank"
              >
                sa fiche sur le site France Renov.
              </a>
            </p>
          )}
          <TwoColumnTable body={data} />
          <p>
            Cette structure possède{" "}
            <strong>{certificationsRGE.certifications.length}</strong>{" "}
            certificat
            {plural}&nbsp;:
          </p>
          <FullTable
            body={certificationsRGE.certifications.map((certification) => [
              <div className="font-small layout-left">
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
            head={["Certificat", "Domaine(s) certifié(s)", "Lien"]}
          />
        </>
      );
    }}
  </DataSection>
);
