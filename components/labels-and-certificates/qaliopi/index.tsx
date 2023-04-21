import { IOrganismeFormation } from '#clients/open-data-soft/dgefp';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { MTPEI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { formatIntFr, formatSiret } from '#utils/helpers';

type OrganismeDeFormationSectionProps = {
  organismesDeFormation: IOrganismeFormation | IAPINotRespondingError;
};

const FAQQaliopi = () => (
  <FAQLink tooltipLabel="certifiée Qualiopi">
    La certification Qualiopi est accordé par le <MTPEI /> aux organismes de
    formation répondant à certains critères de qualité.
    <br />
    <a href="/faq/qualiopi-organisme-formation">→ En savoir plus</a>
  </FAQLink>
);

export const OrganismeDeFormationSection = ({
  organismesDeFormation,
}: OrganismeDeFormationSectionProps) => {
  if (isAPINotResponding(organismesDeFormation)) {
    const isNotFound = organismesDeFormation.errorType === 404;

    if (isNotFound) {
      return (
        <Section
          title="Qualiopi - Organisme de formation"
          sources={[EAdministration.MTPEI]}
        >
          <p>
            Cette structure est <FAQQaliopi />. C’est un organisme dont les
            formations peuvent obtenir un financement public. En revanche nous
            n’avons pas retrouvé le détail de ses certifications auprès de la
            <MTPEI />
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={organismesDeFormation.administration}
        errorType={organismesDeFormation.errorType}
      />
    );
  }

  return (
    <Section
      title="Qualiopi - Organisme de formation"
      sources={[EAdministration.MTPEI]}
      lastModified={organismesDeFormation.lastModified}
    >
      Cette structure est <FAQQaliopi />. C’est un organisme dont les formations
      peuvent obtenir un financement public.
      <br />
      <br />
      <FullTable
        head={[
          "Siret de l'établissement certifié",
          'Numéro Déclaration Activité',
          'Nombre de stagiaires',
          'Certifications',
        ]}
        body={organismesDeFormation.records.map((fields) => [
          <a href={`/etablissement/${fields.siretetablissementdeclarant}`}>
            {formatSiret(fields.siretetablissementdeclarant)}
          </a>,
          <Tag>{formatIntFr(fields.numerodeclarationactivite)}</Tag>,
          fields.informationsdeclarees_nbstagiaires || '',
          fields.certifications.map((certification) => (
            <Tag color="info">{certification}</Tag>
          )),
        ])}
      />
    </Section>
  );
};
