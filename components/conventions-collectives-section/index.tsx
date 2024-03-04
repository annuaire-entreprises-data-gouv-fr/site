import React, { Fragment } from 'react';
import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import { ClientDataSection } from '#components/section/client-data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  ICCExplanation,
  ICCWithMetadata,
} from '#models/conventions-collectives-list';
import { capitalize, formatSiret } from '#utils/helpers';

function ConventionsCollectivesExplanations({
  ccWithMetadata,
}: {
  ccWithMetadata: ICCWithMetadata[];
}) {
  const ccWithexplanations = ccWithMetadata
    .map(({ explanation }) => explanation)
    .filter((e): e is ICCExplanation => !!e);

  if (ccWithexplanations.length == 0) {
    return null;
  }

  const plural = ccWithexplanations.length > 1 ? 's' : '';

  return (
    <Info>
      {ccWithexplanations.length} convention{plural} collective{plural} n
      {ccWithexplanations.length > 1 ? 'e sont' : '’est'} plus en vigueur :
      <ul>
        {ccWithexplanations.map(({ idcc, splitted, redirect }) => (
          <Fragment key={idcc}>
            {redirect && (
              <li>
                <Tag>IDCC {idcc}</Tag> a été remplacée par{' '}
                <Tag>IDCC {redirect}</Tag>
              </li>
            )}
            {splitted && (
              <li>
                <Tag>IDCC {idcc}</Tag> a été découpée entre{' '}
                {splitted.map((cc, index) => (
                  <Fragment key={index}>
                    {index !== 0 && 'et '}
                    <Tag>IDCC {cc}</Tag>
                  </Fragment>
                ))}
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </Info>
  );
}

const ConventionsCollectivesSection: React.FC<{
  ccWithMetadata: ICCWithMetadata[] | IAPINotRespondingError;
}> = ({ ccWithMetadata }) => {
  return (
    <ClientDataSection
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
            <ConventionsCollectivesExplanations
              ccWithMetadata={ccWithMetadata}
            />
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
                          <strong className="font-small">
                            {capitalize(nature)}
                          </strong>
                          <br />
                        </>
                      )}
                      <span className="font-small">
                        {title || <NonRenseigne />}
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
    </ClientDataSection>
  );
};
export default ConventionsCollectivesSection;
