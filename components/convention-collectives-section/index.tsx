import React from 'react';

import { FullTable } from '../table/full';
import { EAdministration } from '../../models/administrations';
import { Tag } from '../../components-ui/tag';
import { Section } from '../section';
import ButtonLink from '../../components-ui/button';
import { IConventionCollective } from '../../models/convention-collective';
import AdministrationNotResponding from '../administration-not-responding';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import routes from '../../clients/routes';
import { METI } from '../administrations';

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
          Cette entité n’a pas de{' '}
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
          <p>
            Cette entité possède {conventionCollectives.length} convention
            {plural} collective{plural} enregistrée{plural}. Pour en savoir plus
            sur les conventions collectives, vous pouvez consulter{' '}
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
                {convention.siret}
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
