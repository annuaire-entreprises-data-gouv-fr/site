import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { capitalize, formatSiret } from '#utils/helpers';

const ConventionsCollectivesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const conventionsCollectives = Object.values(
    uniteLegale.conventionsCollectives || []
  );
  const countIdCc = conventionsCollectives
    ? Object.keys(conventionsCollectives).length
    : 0;

  const plural = countIdCc > 0 ? 's' : '';

  return (
    <Section title="Conventions collectives" sources={[EAdministration.MTPEI]}>
      {countIdCc === 0 ? (
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
      ) : (
        <>
          Cette structure possède {countIdCc}{' '}
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
          <FullTable
            head={['N°IDCC', 'Détails', 'Etablissement(s)', 'Explications']}
            body={conventionsCollectives.map(
              ({ idcc, sirets = [], metadata = {} }) => [
                <Tag>IDCC {idcc}</Tag>,
                <>
                  {metadata.nature && (
                    <>
                      <b className="font-small">
                        {capitalize(metadata.nature)}
                      </b>
                      <br />
                    </>
                  )}
                  <span className="font-small">
                    {metadata.title || <i>Non renseigné</i>}
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
                      small
                    >
                      ⇢&nbsp;Consulter
                    </ButtonLink>
                  )}
                </>,
              ]
            )}
          />
        </>
      )}
    </Section>
  );
};
export default ConventionsCollectivesSection;
