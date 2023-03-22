import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IBioCompany } from '#models/certifications/bio';
import { IUniteLegale } from '#models/index';
import { formatDate } from '#utils/helpers';

type Certification = IBioCompany['certifications'][0];

export const CertificationsBioSection: React.FC<{
  uniteLegale: IUniteLegale;
  bio: IBioCompany | IAPINotRespondingError;
}> = ({ bio }) => {
  const sectionTitle = 'Agence BIO';

  if (isAPINotResponding(bio)) {
    const isNotFound = bio.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
          <p>
            Nous n’avons pas retrouvé les certifications BIO de cette
            entreprise. En revanche, vous pouvez peut-être les retrouver grâce
            au{' '}
            <a
              href={routes.certifications.bio.site}
              target="_blank"
              rel="noreferrer"
            >
              moteur de recherche de l&apos;agence Bio
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

  const {
    numeroBio,
    phone,
    businessPhone,
    email,
    websites,
    activities,
    categories,
    products,
  } = bio;

  const hasMultipleWebsite = websites ? websites?.length > 1 : false;

  const data = [
    [
      "Lien vers l'annuaire BIO",
      <a
        target="_blank"
        href={`https://annuaire.agencebio.org/fiche/${numeroBio}`}
        rel="noreferrer"
      >
        https://annuaire.agencebio.org/fiche/{numeroBio}
      </a>,
    ],
    ['Numéro BIO', `${numeroBio}`],
    ['Numéro de téléphone', phone],
    ['Numéro de téléphone commerciale', businessPhone],
    ['E-mail', email],
    [
      `Site${hasMultipleWebsite ? 's' : ''} web`,
      websites?.length ? (
        hasMultipleWebsite ? (
          <ul>
            {websites?.map((site) => (
              <li>
                <a href={site} target="_blank" rel="noreferrer">
                  {site}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <a href={websites[0]} target="_blank" rel="noreferrer">
            {websites[0]}
          </a>
        )
      ) : (
        ''
      ),
    ],
    ['Activités', activities?.map((activity) => <Tag>{activity}</Tag>)],
    [
      'Catégories',
      categories?.map((category) => <Tag color="info">{category}</Tag>),
    ],
    [
      'Listes des produits',
      <ul>
        {products?.map((product) => (
          <li>{product}</li>
        ))}
      </ul>,
    ],
  ];

  const plural = bio.certifications.length > 1 ? 's' : '';

  const getCertificationDate = (certification: Certification) => {
    const { status, date } = certification;
    const mapping = {
      ARRETEE: <Tag color="error">Arrêtée le {formatDate(date.end)}</Tag>,
      ENGAGEE: <Tag color="success">Engagée le {formatDate(date.start)}</Tag>,
      'NON ENGAGEE': <Tag>Non engagée</Tag>,
      SUSPENDUE: (
        <Tag color="warning">Suspendue depuis le {date.suspension}</Tag>
      ),
    };
    return status ? mapping[status] : 'Non renseigné';
  };

  return (
    <Section title={sectionTitle} sources={[EAdministration.AGENCE_BIO]}>
      Cette structure est une entreprise{' '}
      <FAQLink tooltipLabel="certifiée bio">
        La certification BIO est accordée par les pouvoirs.
        <br />
        {/* TODO : SHOULD ADD FAQ LINK */}
        <a href="/faq/agence-bio">→ En savoir plus</a>
      </FAQLink>
      .
      <div style={{ marginTop: 24 }}>
        <TwoColumnTable body={data} />
      </div>
      <p>
        Cette structure possède <b>{bio.certifications.length}</b> certificat
        {plural}&nbsp;:
      </p>
      <FullTable
        head={['Organisme', 'Date de notification', 'État', 'Lien']}
        body={bio.certifications.map((certification) => [
          <div className="font-small layout-left">
            {certification.organization || 'Non renseigné'}
          </div>,
          <div className="font-small layout-left">
            {formatDate(certification.date.notification) || 'Non renseigné'}
          </div>,
          <div className="font-small layout-left">
            {getCertificationDate(certification)}
          </div>,
          <ButtonLink target="_blank" to={certification.url} alt small>
            ⇢&nbsp;Consulter
          </ButtonLink>,
        ])}
      />
    </Section>
  );
};
