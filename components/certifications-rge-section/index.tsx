import React, { ReactComponentElement, ReactElement } from 'react';
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
import { IRGECompanyCertifications } from '#models/certifications';
import { IUniteLegale } from '#models/index';
import { formatIntFr } from '#utils/helpers';
import { certificatLogo } from './map-certicat-to-logo';

export const CertificationsRGESection: React.FC<{
  uniteLegale: IUniteLegale;
  certificationsRGE: IRGECompanyCertifications | IAPINotRespondingError;
}> = ({ uniteLegale, certificationsRGE }) => {
  if (isAPINotResponding(certificationsRGE)) {
    const isNotFound = certificationsRGE.errorType === 404;
    if (isNotFound) {
      return (
        <Section
          title="Recensement des professionnels RGE (Reconnu Garant de l'Environnement)"
          sources={[EAdministration.ADEME]}
        >
          <p>
            Nous n’avons pas retrouvé les certifications RGE de cette entreprise
            dans l’annuaire des professionnels qualifiés. En revanche, vous
            pouvez probablement retrouver les certifications RGE grâce au
            [moteur de recherche France Renov
            Officiel](https://france-renov.gouv.fr/annuaire-rge).
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={certificationsRGE.administration}
        errorType={certificationsRGE.errorType}
        title="Recensement des professionnels RGE (Reconnu Garant de l'Environnement)"
      />
    );
  }

  let data: Array<[string, string | ReactElement]> = [];

  if (certificationsRGE.companyInfo) {
    const { adresse, telephone, siteInternet, email, workingWithIndividual } =
      certificationsRGE.companyInfo;
    data = [
      ['Dénomination', uniteLegale.nomComplet],
      ['SIREN', formatIntFr(uniteLegale.siren)],
      ['Adresse postale', adresse],
      ['Téléphone', telephone],
      ['Site internet', siteInternet],
      ['Email', email],
      [
        'Travaille avec',
        <div>
          <Tag>Professionnel</Tag>
          {workingWithIndividual && <Tag>Particulier</Tag>}
        </div>,
      ],
    ];
  }

  const plural = certificationsRGE.certifications.length > 1 ? 's' : '';

  return (
    <Section
      title="Recensement des professionnels RGE (Reconnu Garant de l'Environnement)"
      sources={[EAdministration.ADEME]}
    >
      <TwoColumnTable body={data} />
      {!certificationsRGE.companyInfo ? (
        <div>Cette structure n’a aucune certification RGE</div>
      ) : (
        <>
          <p>
            Cette structure possède{' '}
            <b>{certificationsRGE.certifications.length}</b> certification
            {plural} RGE
          </p>
          <FullTable
            head={['Domaine', '', 'Certificat', 'Lien vers le certificat']}
            body={certificationsRGE.certifications.map((certification) => [
              <div>
                <ul>
                  {certification.domaines.map((domaine) => (
                    <li className="font-small">{domaine}</li>
                  ))}
                </ul>
              </div>,
              <div>
                <div className="logo-wrapper" style={{ width: 72 }}>
                  {certificatLogo[certification.nomCertificat] && (
                    <img
                      src={certificatLogo[certification.nomCertificat].logo}
                      alt={certificatLogo[certification.nomCertificat].alt}
                      title={certificatLogo[certification.nomCertificat].alt}
                      width="100%"
                      height="100%"
                    />
                  )}
                </div>
              </div>,
              <div className="font-small">
                <i>{certification.nomCertificat}</i>
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
        </>
      )}
      <style jsx>{`
        .annonce {
          margin: 5px 0;
        }
      `}</style>
    </Section>
  );
};
