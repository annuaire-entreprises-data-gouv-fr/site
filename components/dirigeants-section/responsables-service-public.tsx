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
      title={`Dirigeants`}
      sources={[EAdministration.DILA]}
      notFoundInfo={<NotFoundInfo />}
      data={servicePublic}
    >
      {(servicePublic) => (
        <>
          {!servicePublic.affectationPersonne ? (
            <p>
              Ce service public n’a pas d’équipe dirigeante enregistrée auprès
              de la <DILA />.
            </p>
          ) : (
            <>
              <p>Ce service public est dirigé par les personnes suivantes :</p>

              <FullTable
                head={['Role', 'Nom', 'Nomination']}
                body={servicePublic.affectationPersonne.map((personne) => [
                  personne.fonction,
                  personne.nom,
                  personne.lienTexteAffectation ? (
                    <a
                      href={personne.lienTexteAffectation.valeur}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${personne.lienTexteAffectation.libelle}, nouvelle fenêtre`}
                    >
                      {personne.lienTexteAffectation.libelle}
                    </a>
                  ) : (
                    <NonRenseigne />
                  ),
                ])}
              />
            </>
          )}

          {servicePublic.liens.organigramme && (
            <p>
              Vous pouvez également consulter le lien suivant :{' '}
              <a
                href={servicePublic.liens.organigramme.valeur}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir ${servicePublic.liens.organigramme.libelle}, nouvelle fenêtre`}
              >
                {servicePublic.liens.organigramme.libelle}
              </a>
            </p>
          )}
          {servicePublic.liens.annuaireServicePublic && (
            <p>
              Plus d’informations sur{' '}
              <a
                href={servicePublic.liens.annuaireServicePublic.valeur}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Voir la page de l’annuaire du service-public, Nouvelle fenêtre"
              >
                l’annuaire du service-public
              </a>
            </p>
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
