import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { METI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IConventionCollective } from '#models/convention-collective';
import { formatSiret } from '#utils/helpers';

const ConventionCollectivesSection: React.FC<{
  conventionCollectives: IConventionCollective[] | IAPINotRespondingError;
}> = ({ conventionCollectives }) => {
  if (isAPINotResponding(conventionCollectives)) {
    return (
      <AdministrationNotResponding
        administration={conventionCollectives.administration}
        errorType={conventionCollectives.errorType}
        title="Conventions collectives"
      />
    );
  }

  const plural = conventionCollectives.length > 1 ? 's' : '';

  return (
    <Section title="Conventions collectives" sources={[EAdministration.METI]}>
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
          auprès du <METI />.
        </div>
      ) : (
        <>
          Cette structure possède {conventionCollectives.length}{' '}
          <FAQLink tooltipLabel={`convention${plural} collective${plural}`}>
            <a href="/faq/convention-collective">
              Qu’est-ce qu’une convention collective ?
            </a>
          </FAQLink>{' '}
          enregistrée{plural}.
          <p>
            Pour en savoir plus sur une convention collective en particulier,
            consultez{' '}
            <a
              rel="noreferrer noopener nofollow"
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
              <Tag>{convention.idccNumber}</Tag>,
              <i className="font-small">{convention.title}</i>,
              <ButtonLink target="_blank" to={convention.url} alt small>
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
