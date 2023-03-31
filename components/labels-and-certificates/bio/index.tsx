import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
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
        le {formatDate(date.end)},{' '}
      </>
    ),
    ENGAGEE: (
      <>
        <Tag color="success">Engagée</Tag>
        le {formatDate(date.start)},{' '}
      </>
    ),
    'NON ENGAGEE': <Tag>Non engagée</Tag>,
    SUSPENDUE: (
      <>
        <Tag color="warning">Suspendue</Tag>
        le {date.suspension},{' '}
      </>
    ),
  };
  return status ? mapping[status] : 'Non renseigné';
};

export const CertificationsBioSection: React.FC<{
  uniteLegale: IUniteLegale;
  bio: IEtablissementsBio | IAPINotRespondingError;
}> = ({ bio }) => {
  const sectionTitle = 'Professionnel du Bio';

  if (isAPINotResponding(bio)) {
    if (bio.errorType === 404) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
          <p>
            Nous n’avons pas retrouvé les certifications Bio de cette
            entreprise. En revanche, vous pouvez peut-être les retrouver grâce
            au{' '}
            <a
              href={routes.certifications.bio.site}
              target="_blank"
              rel="noreferrer"
            >
              moteur de recherche de l&apos;Agence Bio
            </a>
            .
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
  const plural = bio.etablissementsBio.length > 0 ? 's' : '';

  return (
    <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
      <p>
        Cette structure possède {bio.etablissementsBio.length} établissement
        {plural} certifié{plural} professionnel{plural} du Bio&nbsp;:
      </p>
      <FullTable
        head={[
          'Détail établissement',
          'Annuaire professionnels Bio',
          'Statut certification',
          'Certificat',
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
            <a href={`${routes.certifications.bio.entreprise}${numeroBio}`}>
              →&nbsp;consulter
            </a>,
            <>
              {getCertificationDate(certificat)}
              {certificat.organization && (
                <div>par {certificat.organization}</div>
              )}
            </>,
            <>
              {certificat.url ? (
                <ButtonLink target="_blank" to={certificat.url} alt small>
                  ⇢&nbsp;Consulter
                </ButtonLink>
              ) : (
                ''
              )}
            </>,
          ]
        )}
      />
    </Section>
  );
};
