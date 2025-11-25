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
          Cet organisme déclare exercer une activité d’entrepreneur de
          spectacles vivants, à titre principal ou occasionnel. Cette activité
          ne peut être exercée qu’en cas de détention de licence d’entrepreneur
          de spectacles vivants (récépissé de déclaration au statut « valide »),
          sauf exceptions suivantes : moins de 7 spectacles par an sont
          organisés et soit l’activité principale n’est pas le spectacle soit
          l’organisme est un groupement d’artistes amateurs.
          <br />
          <br />
          Le numéro d’un récépissé « valide » vaut numéro de licence. La licence
          est attribuée pour cinq ans, sauf retrait en cas d’illégalité. La
          catégorie de licence indiquée par le préfixe du numéro indique le
          métier pour lequel la licence est accordée (exploitant de lieu,
          producteur, diffuseur, tourneur).
          <br />
          <br />
          Pour toute information complémentaire veuillez consulter la plateforme
          des entrepreneurs de spectacles vivants :{" "}
          <a
            href="https://www.culture.gouv.fr/thematiques/theatre-spectacles/pour-les-professionnels/plateforme-des-entrepreneurs-de-spectacles-vivants"
            rel="noreferrer noopener"
            target="_blank"
          >
            cliquez ici
          </a>
          <br />
          <br />
          <strong>Si cet organisme est votre organisme :</strong>
          <br />
          Pour toute question concernant le contenu de votre déclaration
          veuillez consulter la direction des affaires régionales de votre
          établissement principal.
          <br />
          Pour toute question technique veuillez consulter la page suivante :{" "}
          <a
            href="https://www.culture.gouv.fr/aides-demarches/prise-en-main-et-utilisation-de-demarches-simplifiees"
            rel="noreferrer noopener"
            target="_blank"
          >
            cliquez ici
          </a>
          <br />
          <br />
          <FullTable
            body={entrepreneurSpectacles.licences.map(
              ({
                numeroRecepisse,
                categorie,
                nomLieu,
                type,
                dateValidite,
                statut,
                dateFinValidite,
              }) => [
                <Tag>{numeroRecepisse}</Tag>,
                <>
                  <i>{type}</i>
                  <br />
                  {formatLicence(categorie, nomLieu)}
                </>,
                <Validity
                  dateDeValidite={dateValidite}
                  dateFinValidite={dateFinValidite}
                  statut={(statut || "").toLowerCase()}
                />,
              ]
            )}
            head={["Numéro de récépissé", "Type de déclaration", "Validité"]}
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

const Validity = ({
  statut = "",
  dateDeValidite,
  dateFinValidite,
}: {
  statut: string;
  dateDeValidite: string;
  dateFinValidite: string | null;
}) => {
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
          {dateFinValidite ? ` depuis le ${formatDate(dateFinValidite)}` : ""}
        </InformationTooltip>
      );
    case "invalide":
      return (
        <InformationTooltip
          label="La déclaration a été refusée. L'exercice de la profession au titre de cette déclaration est interdit."
          tabIndex={0}
        >
          <Tag color="error">Invalide</Tag>
          {dateFinValidite ? ` depuis le ${formatDate(dateFinValidite)}` : ""}
        </InformationTooltip>
      );
    case "expiré":
      return (
        <InformationTooltip
          label="La licence est arrivée à expiration de sa durée de validité."
          tabIndex={0}
        >
          <Tag color="error">Expiré</Tag>
          {dateFinValidite ? ` depuis le ${formatDate(dateFinValidite)}` : ""}
        </InformationTooltip>
      );
    default:
      return <Tag color="new">Etat inconnu</Tag>;
  }
};
