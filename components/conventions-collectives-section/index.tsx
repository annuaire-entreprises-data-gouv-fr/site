import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ICCWithMetadata } from '#models/conventions-collectives-list';
import { capitalize, formatSiret } from '#utils/helpers';

const ConventionsCollectivesSection: React.FC<{
  ccWithMetadata: ICCWithMetadata[] | IAPINotRespondingError;
}> = ({ ccWithMetadata }) => {
  return (
    <DataSection
      title="Conventions collectives"
      sources={[EAdministration.MTPEI]}
      notFoundInfo={
        <div>
          Cette structure n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={routes.conventionsCollectives.site}
          >
            convention collective enregistrée
          </a>{' '}
          auprès du <MTPEI />.
        </div>
      }
      data={ccWithMetadata}
    >
      {(ccWithMetadata) => {
        const plural = ccWithMetadata.length > 0 ? 's' : '';
        return (
          <>
            Cette structure possède {ccWithMetadata.length}{' '}
            <FAQLink
              to="/faq/convention-collective"
              tooltipLabel={`convention${plural} collective${plural}`}
            >
              Qu’est-ce qu’une convention collective ?
            </FAQLink>{' '}
            enregistrée{plural}.
            <p>
              Pour en savoir plus sur une convention collective en particulier,
              consultez{' '}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://code.travail.gouv.fr/outils/convention-collective"
              >
                le site du Code du Travail Numérique.
              </a>
            </p>
            {ccWithMetadata && ccWithMetadata.length > 0 && (
              <FullTable
                head={['N°IDCC', 'Détails', 'Etablissement(s)', 'Explications']}
                verticalAlign="top"
                body={ccWithMetadata.map(
                  ({ idcc, sirets = [], nature, title }) => [
                    <Tag id={`idcc-${idcc}`}>IDCC {idcc}</Tag>,
                    <>
                      {nature && (
                        <>
                          <b className="font-small">{capitalize(nature)}</b>
                          <br />
                        </>
                      )}
                      <span className="font-small">
                        {title || <i>Non renseigné</i>}
                      </span>
                    </>,
                    <ul>
                      {(sirets || []).map((siret) => (
                        <li>
                          <a href={`/etablissement/${siret}`}>
                            {formatSiret(siret)}
                          </a>
                        </li>
                      ))}
                    </ul>,
                    <>
                      {idcc === '9999' ? (
                        <i>Non renseigné</i>
                      ) : (
                        <ButtonLink
                          target="_blank"
                          to={`${routes.conventionsCollectives.details}${idcc}`}
                          alt
                          aria-label={`Convention collective ${
                            title || idcc
                          }, consulter les informations`}
                          small
                        >
                          ⇢&nbsp;Consulter
                        </ButtonLink>
                      )}
                    </>,
                  ]
                )}
              />
            )}
          </>
        );
      }}
    </DataSection>
  );
};
export default ConventionsCollectivesSection;
