import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ICCWithMetadata } from '#models/conventions-collectives';
import { capitalize, formatSiret } from '#utils/helpers';

function CCUnknown({ ccWithMetadata }: { ccWithMetadata: ICCWithMetadata[] }) {
  const unknown = ccWithMetadata.filter((e) => e.unknown);

  if (unknown.length == 0) {
    return '.';
  }

  const plural = unknown.length > 1 ? 's' : '';

  return (
    <>
      , mais elle possède {plural ? 'plusieurs' : 'une'}{' '}
      <Tag color="warning">
        IDCC Inconnue{plural} ou supprimée{plural}
      </Tag>{' '}
      qui n’apparai
      {plural ? 'ssent' : 't'} pas dans la{' '}
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://travail-emploi.gouv.fr/dialogue-social/negociation-collective/article/conventions-collectives-nomenclatures"
      >
        liste des conventions collectives en vigueur
      </a>
      , tenue par le <MTPEI />.
    </>
  );
}

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
            enregistrée{plural}
            <CCUnknown ccWithMetadata={ccWithMetadata} />
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
              , le{' '}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://www.legifrance.gouv.fr/liste/bocc"
              >
                bulletin officiel des conventions collectives sur Legifrance
              </a>
              , ou le{' '}
              <a href="https://www.elections-professionnelles.travail.gouv.fr/web/guest/recherche-idcc">
                moteur de recherche de conventions collectives
              </a>
              .
            </p>
            {ccWithMetadata && ccWithMetadata.length > 0 && (
              <FullTable
                head={['N°IDCC', 'Détails', 'Etablissement(s)', 'Explications']}
                verticalAlign="top"
                body={ccWithMetadata.map(
                  ({ idcc, sirets = [], nature, title, unknown, updated }) => [
                    <Tag id={`idcc-${idcc}`}>IDCC {idcc}</Tag>,
                    <>
                      {updated.length > 0 ? (
                        <>
                          <Tag color="new">IDCC Supprimée</Tag> et remplacée par
                          :{' '}
                          <ul>
                            {updated.map((updatedCC, index) => (
                              <li>
                                {index !== 0 && ' ou '}
                                {updatedCC.title}
                                <Tag>IDCC {updatedCC.idcc}</Tag>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : unknown ? (
                        <>
                          <Tag color="warning">IDCC Inconnue</Tag>
                        </>
                      ) : (
                        <>
                          {nature && (
                            <>
                              <strong className="font-small">
                                {capitalize(nature)}
                              </strong>
                              <br />
                            </>
                          )}
                          <span className="font-small">
                            {title || <NonRenseigne />}
                          </span>
                        </>
                      )}
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
                        <i>Sans convention collective</i>
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
