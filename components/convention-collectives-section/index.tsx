import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { MTPEI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { formatSiret } from '#utils/helpers';
import { IUniteLegale } from '#models/index';

const ConventionCollectivesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const conventionCollectives = uniteLegale.etablissements.all.flatMap(
    ({ conventionsCollectives }) => conventionsCollectives
  );

  const plural = conventionCollectives.length > 0 ? 's' : '';

  return (
    <Section title="Conventions collectives" sources={[EAdministration.MTPEI]}>
      {conventionCollectives.length === 0 ? (
        <div>
          Cette structure n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={routes.conventionCollectives.site}
          >
            convention collective enregistrée
          </a>{' '}
          auprès du <MTPEI />.
        </div>
      ) : (
        <>
          Cette structure possède {conventionCollectives.length}{' '}
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
            head={['SIRET', 'N°IDCC', 'Détails', 'Convention']}
            body={conventionCollectives.map((convention) => [
              <a href={`/etablissement/${convention.siret}`}>
                {formatSiret(convention.siret)}
              </a>,
              <Tag>{convention.idcc}</Tag>,
              <i className="font-small">{convention.title}</i>,
              <ButtonLink
                target="_blank"
                to={`https://www.legifrance.gouv.fr/conv_coll/id/${convention.idKali}`}
                alt
                small
              >
                ⇢&nbsp;Consulter
              </ButtonLink>,
            ])}
          />
        </>
      )}
    </Section>
  );
};
export default ConventionCollectivesSection;
