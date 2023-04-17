import { IOrganismeFormation } from '#clients/dgefp';
import { IOrganismesFormationResponse } from '#clients/dgefp/type';
import FAQLink from '#components-ui/faq-link';
import AdministrationNotResponding from '#components/administration-not-responding';
import { MTPEI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';

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
          sources={[EAdministration.ADEME]}
        >
          <p>
            Cette structure est <FAQQaliopi />. C’est un organisme dont les
            formations peuvent obtenir un financement public. En revanche nous
            n’avons pas retrouvé le détail de ses certifications auprès de la{' '}
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
      sources={[EAdministration.MTPEI, EAdministration.DINUM]}
      lastModified={organismesDeFormation.lastModified}
    >
      Cette structure est <FAQQaliopi />. C’est un organisme dont les formations
      peuvent obtenir un financement public.
      <br />
      <br />
      <FullTable
        head={[
          'Numéro Déclaration Activité',
          'Actions de formation',
          'Nombre de stagiaires',
          'Dates',
          'Certifications',
        ]}
        body={organismesDeFormation.records.map((fields) => [
          fields.numerodeclarationactivite,
          fields.certifications_actionsdeformation,
          fields.informationsdeclarees_nbstagiaires,
          fields.informationsdeclarees_datedernieredeclaration,
          fields.certifications,
        ])}
      />
    </Section>
  );
};
