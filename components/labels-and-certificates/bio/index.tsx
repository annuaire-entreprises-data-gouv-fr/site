import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IBioCertification,
  IEtablissementsBio,
} from '#models/certifications/bio';
import { IUniteLegale } from '#models/index';
import { formatDate, formatSiret } from '#utils/helpers';

const getCertificationDate = (certificat: IBioCertification) => {
  const { status, date } = certificat;
  const mapping = {
    ARRETEE: (
      <>
        <Tag color="error">Arrêtée</Tag>
        {date?.end && `le ${formatDate(date.end)}, `}
      </>
    ),
    ENGAGEE: (
      <>
        <Tag color="success">Engagée</Tag>
        {date?.start && `le ${formatDate(date.start)}, `}
      </>
    ),
    'NON ENGAGEE': <Tag>Non engagée</Tag>,
    SUSPENDUE: (
      <>
        <Tag color="warning">Suspendue</Tag>
        {date?.suspension && `le ${date.suspension}, `}
      </>
    ),
  };
  return status ? mapping[status] : 'Non renseigné';
};

const FAQBio = ({ label = 'certification Bio' }) => (
  <FAQLink tooltipLabel={label}>
    Le label “Professionnel du bio” concerne les entreprises dont tout ou partie
    de leur activité est certifiée Bio par des organismes certificateurs,
    encadrés par l’Agence Bio.
    <br />
    <a href="/faq/professionnels-bio">→ En savoir plus</a>
  </FAQLink>
);

export const CertificationsBioSection: React.FC<{
  uniteLegale: IUniteLegale;
  bio: IEtablissementsBio | IAPINotRespondingError;
}> = ({ bio }) => {
  const sectionTitle = 'Professionnel du Bio';

  if (isAPINotResponding(bio)) {
    if (bio.errorType === 404) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
          Nous n’avons pas retrouvé de <FAQBio /> pour cette structure.
          <p>
            Vous pourrez peut-être les trouver sur le{' '}
            <a
              href={routes.certifications.bio.site}
              target="_blank"
              rel="noreferrer"
            >
              moteur de recherche de l&apos;Agence Bio
            </a>
            .
          </p>
          <p>
            Seules les structures avec un certificat en cours de validité
            apparaissent sur cette page.
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={bio.administration}
        errorType={bio.errorType}
        title={sectionTitle}
      />
    );
  }
  const plural = bio.etablissementsBio.length > 1 ? 's' : '';

  return (
    <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
      Cette structure possède {bio.etablissementsBio.length} établissement
      {plural} <FAQBio label={`certifié${plural} “Professionnel du Bio”`} />{' '}
      &nbsp;:
      <br />
      <br />
      <FullTable
        head={[
          'Détail établissement',
          'Statut certification',
          'Certificat',
          'Annuaire professionnels Bio',
        ]}
        body={bio.etablissementsBio.map(
          ({
            numeroBio,
            siret,
            denomination,
            enseigne,
            adresse,
            certificat,
          }) => [
            <>
              {siret && (
                <a href={`/etablissement/${siret}`}>{formatSiret(siret)}</a>
              )}
              {denomination && (
                <div>
                  {denomination}
                  {enseigne && ` (${enseigne})`}
                </div>
              )}
              {adresse && <div>{adresse}</div>}
            </>,
            <>
              {getCertificationDate(certificat)}
              {certificat.organization && (
                <div>par {certificat.organization}</div>
              )}
            </>,
            <>
              {certificat.exempted ? (
                <i>Dispensé de certification</i>
              ) : certificat.url ? (
                <a
                  target="_blank"
                  rel="noreferre noopener"
                  href={certificat.url}
                >
                  <Icon slug="file" color="black">
                    certificat
                  </Icon>
                </a>
              ) : (
                <i>document introuvable</i>
              )}
            </>,
            <div className="layout-right">
              <ButtonLink
                target="_blank"
                alt
                small
                to={`${routes.certifications.bio.entreprise}${numeroBio}`}
              >
                →&nbsp;consulter
              </ButtonLink>
            </div>,
          ]
        )}
      />
    </Section>
  );
};
