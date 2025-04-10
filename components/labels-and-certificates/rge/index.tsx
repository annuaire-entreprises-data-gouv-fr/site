import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ISession } from '#models/authentication/user/session';
import { IRGECertification } from '#models/certifications/rge';
import { IUniteLegale } from '#models/core/types';
import { pluralize } from '#utils/helpers';
import React from 'react';

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
  session: ISession | null;
}> = ({ uniteLegale, certificationsRGE, session }) => {
  return (
    <DataSection
      id="rge"
      title="RGE - Reconnu Garant de l'Environnement"
      sources={[EAdministration.ADEME]}
      data={certificationsRGE}
      notFoundInfo={
        <p>
          Nous n’avons pas retrouvé les certifications RGE de cette entreprise
          dans l’annuaire des professionnels qualifiés. En revanche, vous pouvez
          peut-être les retrouver grâce au{' '}
          <a href={routes.certifications.rge.site}>
            moteur de recherche France Renov Officiel
          </a>
          .
        </p>
      }
    >
      {(certificationsRGE) => {
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
          ['Adresse', adresse],
          [
            'Téléphone',
            telephone && <a href={`tel:${telephone}`}>{telephone}</a>,
          ],
          [
            'Site internet',
            siteInternet && <a href={siteInternet}>{siteInternet}</a>,
          ],
          ['Email', email && <a href={`mailto:${email}`}>{email}</a>],
          [
            'Travaille avec',
            <div>
              <Tag color="info">Professionnels</Tag>
              {workingWithIndividual && <Tag color="info">Particuliers</Tag>}
            </div>,
          ],
        ];

        const plural = pluralize(certificationsRGE.certifications);
        const linkFranceRenov = renovLink(siret);

        return (
          <>
            Cette structure est une entreprise{' '}
            <FAQLink
              tooltipLabel="certifiée RGE - Reconnu Garant de l’Environnement"
              to="/faq/reconnu-garant-environnement"
            >
              La certification RGE est accordée par les pouvoirs publics aux
              professionnels du bâtiment spécialisés dans les travaux
              de rénovation énergétique.
            </FAQLink>
            .
            {linkFranceRenov && (
              <p>
                Vous pouvez consulter{' '}
                <a
                  href={linkFranceRenov}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  sa fiche sur le site France Renov.
                </a>
              </p>
            )}
            <TwoColumnTable body={data} />
            <p>
              Cette structure possède{' '}
              <strong>{certificationsRGE.certifications.length}</strong>{' '}
              certificat
              {plural}&nbsp;:
            </p>
            <FullTable
              head={['Certificat', 'Domaine(s) certifié(s)', 'Lien']}
              body={certificationsRGE.certifications.map((certification) => [
                <div className="font-small layout-left">
                  {certification.logoPath && (
                    <div style={{ width: 72 }}>
                      <img
                        src={certification.logoPath}
                        alt={`Logo ${certification.nomCertificat}`}
                        title={`Logo ${certification.nomCertificat}`}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}
                  <div> {certification.nomCertificat}</div>
                </div>,
                <ul>
                  {certification.domaines.map((domaine) => (
                    <li key={domaine} className="font-small">
                      {domaine}
                    </li>
                  ))}
                </ul>,
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
          </>
        );
      }}
    </DataSection>
  );
};
