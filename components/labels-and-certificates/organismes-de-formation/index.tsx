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
import { IOrganismeFormation } from '#models/certifications/organismes-de-formation';
import { IUniteLegale } from '#models/index';
import { formatIntFr } from '#utils/helpers';

type OrganismeDeFormationSectionProps = {
  organismesDeFormation: IOrganismeFormation | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
};

const FAQQaliopi = () => (
  <FAQLink tooltipLabel="certifiée Qualiopi">
    La certification Qualiopi est accordé par le <MTPEI /> aux organismes de
    formation répondant à certains critères de qualité.
    <br />
    <a href="/faq/qualiopi-organisme-formation">→ En savoir plus</a>
  </FAQLink>
);

const OrganismeFormationLabel = ({ estQualiopi = false }) => (
  <>
    Cette structure est un organisme de formation,{' '}
    <FAQLink tooltipLabel="à jour de ses obligations">
      Un organisme de formation est à jour de ses obligations si il a bien
      déclaré auprès du Préfet de Région territorialement compétent son Bilan
      Pédagogique et Financier.
    </FAQLink>
    .
    {estQualiopi ? (
      <>
        <br />
        <br />
        Cette structure est <FAQQaliopi />. C’est un organisme dont les
        formations peuvent <b>obtenir un financement public</b>.
      </>
    ) : (
      <>
        <br />
        <br />
        Cette structure n’est pas <FAQQaliopi />.
      </>
    )}
  </>
);

export const OrganismeDeFormationSection = ({
  organismesDeFormation,
  uniteLegale,
}: OrganismeDeFormationSectionProps) => {
  const estQualiopi = uniteLegale.complements.estQualiopi;

  if (isAPINotResponding(organismesDeFormation)) {
    const isNotFound = organismesDeFormation.errorType === 404;

    if (isNotFound) {
      return (
        <Section
          title="Organisme de formation"
          sources={[EAdministration.MTPEI]}
        >
          <OrganismeFormationLabel estQualiopi={estQualiopi} />
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

  const head = [
    'Numéro Déclaration Activité (NDA)',
    'Détails',
    ...(estQualiopi ? ['Certification(s) Qualiopi'] : []),
  ];

  const body = organismesDeFormation.records.map((fields) => [
    <Tag>{fields.nda ? fields.nda : 'Inconnu'}</Tag>,
    <>
      {fields.specialite && (
        <>
          <b>Spécialité :</b> {fields.specialite}
          <br />
        </>
      )}
      {fields.stagiaires && (
        <>
          <b>Nombre de stagiaires :</b> {fields.stagiaires}
          <br />
        </>
      )}
      {fields.dateDeclaration && (
        <>
          <b>Déclaration : </b> le {fields.dateDeclaration}
          {fields.region && <>, en région {fields.region}</>}
          <br />
        </>
      )}
    </>,
    ...(estQualiopi
      ? [
          fields.certifications.map((certification) => (
            <Tag color="info" key={certification}>
              {certification}
            </Tag>
          )),
        ]
      : []),
  ]);

  const title = `Organisme de formation${
    uniteLegale.complements.estQualiopi ? ' certifié Qualiopi' : ''
  }`;

  return (
    <Section
      title={title}
      sources={[EAdministration.MTPEI]}
      lastModified={organismesDeFormation.lastModified}
    >
      <OrganismeFormationLabel
        estQualiopi={uniteLegale.complements.estQualiopi}
      />
      <br />
      <br />
      <FullTable head={head} body={body} />
    </Section>
  );
};
