import { DILA } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IServicePublic } from '#models/service-public';

type IProps = { servicePublic: IServicePublic | IAPINotRespondingError };

export default function ResponsableSection({ servicePublic }: IProps) {
  return (
    <DataSection
      id="responsables-service-public"
      title={`Responsable(s)`}
      sources={[EAdministration.DILA]}
      notFoundInfo={<NotFoundInfo />}
      data={servicePublic}
    >
      {(servicePublic) => (
        <>
          {!servicePublic.affectationPersonne ? (
            <p>
              Ce service public n’a pas de responsable enregistré auprès de la{' '}
              <DILA />.
            </p>
          ) : (
            <>
              <p>
                Ce service public possède{' '}
                {servicePublic.affectationPersonne.length} responsable(s)
                enregistré(s) auprès de la <DILA />
                {servicePublic.liens.annuaireServicePublic && (
                  <>
                    {' '}
                    sur{' '}
                    <a
                      href={servicePublic.liens.annuaireServicePublic.valeur}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Voir la page de l’Annuaire du service public, Nouvelle fenêtre"
                    >
                      l’Annuaire du service public
                    </a>
                  </>
                )}
                {servicePublic.liens.organigramme && (
                  <>
                    {' '}
                    et publie un{' '}
                    <a
                      href={servicePublic.liens.organigramme.valeur}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Voir ${servicePublic.liens.organigramme.libelle}, nouvelle fenêtre`}
                    >
                      organigramme
                    </a>
                  </>
                )}
                .
              </p>

              <FullTable
                head={['Role', 'Nom', 'Nomination']}
                body={servicePublic.affectationPersonne.map((personne) => [
                  personne.fonction,
                  personne.nom ?? <NonRenseigne />,
                  personne.lienTexteAffectation ? (
                    <a
                      href={personne.lienTexteAffectation.valeur}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${
                        personne.lienTexteAffectation.libelle ||
                        'Voir la nomination'
                      }, nouvelle fenêtre`}
                    >
                      {personne.lienTexteAffectation.libelle ||
                        'Voir la nomination'}
                    </a>
                  ) : (
                    <NonRenseigne />
                  ),
                ])}
              />
            </>
          )}
        </>
      )}
    </DataSection>
  );
}

const NotFoundInfo = () => (
  <p>
    Ce service public n’est pas enregistré auprès de la <DILA />.
  </p>
);
