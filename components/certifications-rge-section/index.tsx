import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
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
import { IRGECertification } from '#models/certifications';
import { IUniteLegale } from '#models/index';
import { certificatLogo } from './map-certicat-to-logo';

const renovLink = (slug: string) => {
  try {
    return `${routes.certifications.rge.site}/identifier?company=${slug}&date=${
      new Date().toISOString().split('T')[0]
    }`;
  } catch {
    return '';
  }
};

export const CertificationsRGESection: React.FC<{
  uniteLegale: IUniteLegale;
  certificationsRGE: IRGECertification | IAPINotRespondingError;
}> = ({ uniteLegale, certificationsRGE }) => {
  const sectionTitle = "RGE - Reconnu Garant de l'Environnement";

  if (isAPINotResponding(certificationsRGE)) {
    const isNotFound = certificationsRGE.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.ADEME]}>
          <p>
            Nous n’avons pas retrouvé les certifications RGE de cette entreprise
            dans l’annuaire des professionnels qualifiés. En revanche, vous
            pouvez peut-être les retrouver grâce au{' '}
            <a href={routes.certifications.rge.site}>
              moteur de recherche France Renov Officiel
            </a>
            .
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={certificationsRGE.administration}
        errorType={certificationsRGE.errorType}
        title={sectionTitle}
      />
    );
  }

  const {
    adresse,
    telephone,
    siret,
    siteInternet,
    email,
    workingWithIndividual,
  } = certificationsRGE.companyInfo;

  const data = [
    ['Dénomination', uniteLegale.nomComplet],
    ['Adresse postale', adresse],
    ['Téléphone', telephone && <a href={`tel:${telephone}`}>{telephone}</a>],
    [
      'Site internet',
      siteInternet && <a href={siteInternet}>{siteInternet}</a>,
    ],
    ['Email', email && <a href={`mailto:${email}`}>{email}</a>],
    [
      'Travaille avec',
      <div>
        <Tag className="info">Professionnel</Tag>
        {workingWithIndividual && <Tag className="info">Particulier</Tag>}
      </div>,
    ],
  ];

  const plural = certificationsRGE.certifications.length > 1 ? 's' : '';
  const linkFranceRenov = renovLink(siret);

  return (
    <Section title={sectionTitle} sources={[EAdministration.ADEME]}>
      <p>
        Cette structure est une entreprise certifiée RGE - Reconnu Garant de
        l’Environnement.
      </p>
      <p>
        {linkFranceRenov && (
          <>
            Vous pouvez consulter{' '}
            <a href={linkFranceRenov} target="_blank" rel="noreferrer noopener">
              sa fiche sur le site France Renov.
            </a>
          </>
        )}
      </p>
      <TwoColumnTable body={data} />
      <p>
        Cette structure possède <b>{certificationsRGE.certifications.length}</b>{' '}
        certificat{plural}&nbsp;:
      </p>
      <FullTable
        head={['Certificat', 'Domaine(s) certifié(s)', 'Lien']}
        body={certificationsRGE.certifications.map((certification) => [
          <div className="font-small">
            <div className="logo-wrapper" style={{ width: 72 }}>
              {certification.nomCertificat in certificatLogo && (
                <img
                  //@ts-ignore
                  src={certificatLogo[certification.nomCertificat]}
                  alt={`Logo ${certification.nomCertificat}`}
                  title={`Logo ${certification.nomCertificat}`}
                  width="100%"
                  height="100%"
                />
              )}
            </div>
            <i>{certification.nomCertificat}</i>
          </div>,
          <div>
            <ul>
              {certification.domaines.map((domaine) => (
                <li className="font-small">{domaine}</li>
              ))}
            </ul>
          </div>,
          <ButtonLink
            target="_blank"
            to={certification.urlQualification}
            alt
            small
          >
            ⇢&nbsp;Consulter
          </ButtonLink>,
        ])}
      />
    </Section>
  );
};
