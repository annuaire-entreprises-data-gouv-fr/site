import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IOrganismeFormation } from '#models/certifications/organismes-de-formation';

type OrganismeDeFormationSectionProps = {
  organismesDeFormation: IOrganismeFormation | IAPINotRespondingError;
};

export const OrganismeDeFormationSection = ({
  organismesDeFormation,
}: OrganismeDeFormationSectionProps) => {
  return (
    <DataSection
      title="Organisme de formation"
      sources={[EAdministration.MTPEI]}
      id="organisme-de-formation"
      data={organismesDeFormation}
      // if 404 from DGEFP we can assume this organism is NOT qualiopi
      notFoundInfo={<OrganismeFormationLabel qualiopiCertified={false} />}
    >
      {(organismesDeFormation) => {
        // we use definition from DGEFP rather than recherche entreprise which can be outdated
        const qualiopiCertified = organismesDeFormation.qualiopiCertified;

        const head = [
          'Numéro Déclaration Activité (NDA)',
          'Détails',
          ...(qualiopiCertified ? ['Certification(s) Qualiopi'] : []),
        ];

        return (
          <>
            <OrganismeFormationLabel qualiopiCertified={qualiopiCertified} />
            <FullTable
              head={head}
              body={organismesDeFormation.records.map((fields) => [
                <Tag>{fields.nda ? fields.nda : 'Inconnu'}</Tag>,
                <>
                  {fields.specialite && (
                    <>
                      <strong>Spécialité :</strong> {fields.specialite}
                      <br />
                    </>
                  )}
                  {fields.formateurs && (
                    <>
                      <strong>Effectifs formateurs :</strong>{' '}
                      {fields.formateurs}
                      <br />
                    </>
                  )}
                  {fields.stagiaires && (
                    <>
                      <strong>Effectifs stagiaires :</strong>{' '}
                      {fields.stagiaires}
                      <br />
                    </>
                  )}
                  {fields.dateDeclaration && (
                    <>
                      <strong>Déclaration : </strong> le{' '}
                      {fields.dateDeclaration}
                      {fields.region && <>, en région {fields.region}</>}
                      <br />
                    </>
                  )}
                </>,
                ...(qualiopiCertified
                  ? [
                      fields.certifications.map((certification) => (
                        <Tag color="info" key={certification}>
                          {certification}
                        </Tag>
                      )),
                    ]
                  : []),
              ])}
            />{' '}
          </>
        );
      }}
    </DataSection>
  );
};

const FAQQaliopi = () => (
  <FAQLink
    tooltipLabel="certifiée Qualiopi"
    to="/faq/qualiopi-organisme-formation"
  >
    La certification Qualiopi est accordé par le <MTPEI /> aux organismes de
    formation répondant à certains critères de qualité.
  </FAQLink>
);

const OrganismeFormationLabel = ({ qualiopiCertified = false }) => (
  <>
    Cette structure est un organisme de formation,{' '}
    <FAQLink tooltipLabel="à jour de ses obligations">
      Un organisme de formation est à jour de ses obligations si il a bien
      déclaré auprès du Préfet de Région territorialement compétent son Bilan
      Pédagogique et Financier.
    </FAQLink>
    .
    {qualiopiCertified ? (
      <>
        <br />
        <br />
        Cette structure est <FAQQaliopi />. C’est un organisme dont les
        formations peuvent <strong>obtenir un financement public</strong>.
      </>
    ) : (
      <>
        <br />
        <br />
        Cette structure n’est pas <FAQQaliopi />.
      </>
    )}
    <p>
      Le nombre de stagiaires et les spécialités sont déclarés par l’organisme
      de formation dans le Bilan Pédagogique et Financier. La période concernée
      est celle de l’exercice comptable.
    </p>
  </>
);
