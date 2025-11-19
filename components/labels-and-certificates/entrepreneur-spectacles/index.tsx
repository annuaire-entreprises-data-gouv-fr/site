import type React from "react";
import type { IEntrepreneursSpectacles } from "#clients/api-data-gouv/entrepreneurs-spectacles/interface";
import { MC } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { DataSection } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import { formatDate, pluralize } from "#utils/helpers";

export const CertificationsEntrepreneurSpectaclesSection: React.FC<{
  entrepreneurSpectacles: IEntrepreneursSpectacles | IAPINotRespondingError;
}> = ({ entrepreneurSpectacles }) => (
  <DataSection
    data={entrepreneurSpectacles}
    id="entrepreneur-spectacles"
    notFoundInfo={
      <>
        <p>
          Nous n’avons pas retrouvé de récépissé de déclaration <FAQ /> déposé
          auprès du <MC /> pour cette structure.
        </p>
        <p>
          Pour effectuer une déclaration, rendez-vous sur{" "}
          <a
            href="https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#deux"
            rel="noreferrer noopener"
            target="_blank"
          >
            la plateforme PLATES
          </a>
        </p>
      </>
    }
    sources={[EAdministration.MC]}
    title="Entrepreneur de spectacles vivants"
  >
    {(entrepreneurSpectacles) => {
      const plural = pluralize(entrepreneurSpectacles.licences);

      return (
        <>
          Cette structure possède {plural ? "plusieurs" : "un"} récépissé
          {plural} de déclaration d’activité <FAQ /> déposé{plural} sur{" "}
          <a
            href="https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#deux"
            rel="noreferrer noopener"
            target="_blank"
          >
            la plateforme PLATES
          </a>{" "}
          du <MC />.
          <p>
            Le <strong>numéro de récépissé est le numéro de déclaration</strong>
            . Le récépissé est valide 30 jours après que le dossier ait été reçu
            complet et conforme à la réglementation. Un récépissé de déclaration
            au statut valide est <strong>valable pour cinq ans</strong>.
          </p>
          <p>
            Si une déclaration que vous avez faite n’apparaît pas sur le tableau
            après plus d’un mois, veuillez contacter{" "}
            <a href="https://mesdemarches.culture.gouv.fr/loc_fr/mcc/?__CSRFTOKEN__=ade60dc8-891d-439e-b355-0438dea9a33c">
              le service des démarches en lignes
            </a>{" "}
            du <MC />.
          </p>
          <FullTable
            body={entrepreneurSpectacles.licences.map(
              ({
                numeroRecepisse,
                categorie,
                nomLieu,
                type,
                dateDepot,
                dateValidite,
                statut,
              }) => [
                <Tag>{numeroRecepisse}</Tag>,
                <>
                  <i>{type}</i>
                  <br />
                  {formatLicence(categorie, nomLieu)}
                </>,
                formatDate(dateDepot),
                <Validity
                  dateDeValidite={dateValidite}
                  statut={(statut || "").toLowerCase()}
                />,
              ]
            )}
            head={[
              "Numéro de récépissé",
              "Type de déclaration",
              "Date de dépôt",
              "Validité",
            ]}
          />
        </>
      );
    }}
  </DataSection>
);

const FAQ = () => (
  <FAQLink
    to="/faq/entrepreneur-spectacles-vivants"
    tooltipLabel="d’entrepreneur de spectacles vivants"
  >
    Un entrepreneur de spectacles vivants désigne toute personne qui exerce une
    activité d’exploitation de lieux de spectacles, de production ou de
    diffusion de spectacles.
  </FAQLink>
);

const formatLicence = (categorie: string, type: string, nomLieu = "") => {
  switch (categorie) {
    case "1":
      return (
        <>
          <strong>Exploitant de lieu de spectacles vivant</strong>
          {nomLieu && (
            <>
              <br />
              <Icon slug="mapPin">{nomLieu}</Icon>
            </>
          )}
        </>
      );
    case "2":
      return (
        <strong>Producteurs de spectacles ou entrepreneurs de tournées</strong>
      );
    case "3":
      return <strong>Diffuseurs de spectacles</strong>;
    default:
      return <NonRenseigne />;
  }
};

const Validity = ({ statut = "", dateDeValidite = "" }) => {
  switch (statut) {
    case "valide":
      return (
        <InformationTooltip
          label="La déclaration vaut récépissé. L'exercice de la profession est licite."
          tabIndex={0}
        >
          <Tag color="success">valide</Tag>
          {dateDeValidite ? ` depuis le ${formatDate(dateDeValidite)}` : ""}
        </InformationTooltip>
      );
    case "en instruction":
      return (
        <InformationTooltip
          label="Instruction du dossier en cours. L'exercice de la profession au titre de cette déclaration est interdit."
          tabIndex={0}
        >
          <Tag color="info">En instruction</Tag>
        </InformationTooltip>
      );
    case "invalidé":
      return (
        <InformationTooltip
          label="Le récépissé a été retirée après une période de validité."
          tabIndex={0}
        >
          <Tag color="error">Invalidé</Tag>
          {dateDeValidite ? ` depuis le ${dateDeValidite}` : ""}
        </InformationTooltip>
      );
    case "invalide":
      return (
        <InformationTooltip
          label="La déclaration a été refusée. L'exercice de la profession au titre de cette déclaration est interdit."
          tabIndex={0}
        >
          <Tag color="error">Invalide</Tag>
        </InformationTooltip>
      );
    case "expiré":
      return (
        <InformationTooltip
          label="La licence est arrivée à expiration de sa durée de validité."
          tabIndex={0}
        >
          <Tag color="error">Expiré</Tag>
        </InformationTooltip>
      );
    default:
      return <Tag color="new">Etat inconnu</Tag>;
  }
};
