import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { ProtectedSection } from '#components/section/protected-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import {
  IAssoDocument,
  ISubventionsAssociation,
} from '#models/espace-agent/subventions-association';

const DocumentList: React.FC<{ label: string; documentList: IAssoDocument[] }> =
  ({ label, documentList }) => (
    <>
      {documentList.length > 0 ? (
        <>
          <b>{label} :</b>
          <ul>
            {documentList.map(({ annee, nom, url }) => [
              <li>
                <a href={url} rel="noopener noreferre" target="__blank">
                  {nom}
                </a>
                {annee ? ` (${annee})` : ''}
              </li>,
            ])}
          </ul>
        </>
      ) : null}
    </>
  );

const DocumentsNotFound = () => (
  <ProtectedSection title="Statuts" sources={[EAdministration.MI]}>
    Nous n’avons pas retrouvé de documents pour cette association.
  </ProtectedSection>
);

export const AssociationDocumentSection = ({
  subventionsDocuments,
}: ISubventionsAssociation) => {
  if (isAPINotResponding(subventionsDocuments)) {
    if (subventionsDocuments.errorType === 404) {
      return <DocumentsNotFound />;
    }
    return (
      <AdministrationNotResponding
        administration={subventionsDocuments.administration}
        errorType={subventionsDocuments.errorType}
        title="Documents"
      />
    );
  }

  return (
    <ProtectedSection title="Documents" sources={[EAdministration.MI]}>
      <p>
        Retrouvez les rapports d’activités, les rapports financiers, les comptes
        et les exercices comptables de cette association, pour chaque
        établissement&nbsp;:
      </p>
      <FullTable
        head={['Siret', 'Détails de l’établissement']}
        body={subventionsDocuments.dac.map(
          (
            {
              siret,
              adresse,
              estSiege,
              comptes,
              rapportFinancier,
              rapportActivite,
              exerciceComptable,
            },
            index
          ) => [
            <a href={`/etablissement/${siret}`}>{siret}</a>,
            <div className="details-etablissement">
              {adresse}
              {estSiege ? <Tag color="info">siège social</Tag> : null}
              <span style={{ flexGrow: 1 }} />
              {comptes.length === 0 &&
              rapportActivite.length === 0 &&
              rapportFinancier.length === 0 &&
              exerciceComptable.length === 0 ? (
                <i>Aucun document n’a été déclaré pour cet établissement.</i>
              ) : (
                <div id={`etablissement-${siret}`} className="documents">
                  <input
                    type="checkbox"
                    id={`toggle-${index}`}
                    aria-hidden="true"
                  />
                  <label
                    className="cursor-pointer show"
                    htmlFor={`toggle-${index}`}
                  >
                    afficher les documents ▾
                  </label>
                  <label
                    className="cursor-pointer hide"
                    htmlFor={`toggle-${index}`}
                  >
                    réduire ✕
                  </label>
                  <div>
                    <br />
                    <DocumentList documentList={comptes} label="Comptes" />
                    <DocumentList
                      documentList={rapportFinancier}
                      label="Rapport financier"
                    />
                    <DocumentList
                      documentList={rapportActivite}
                      label="Rapport d’activité"
                    />
                    {exerciceComptable.length > 0 && (
                      <>
                        <b>Exercice(s) comptable(s) :</b>
                        <FullTable
                          head={[
                            'Année',
                            ...exerciceComptable.map((e) => e.annee),
                          ]}
                          body={[
                            ['Cause des subventions', 'cause_subventions'],
                            ['Subventions', 'montant_subventions'],
                            ['Dons', 'montant_dons'],
                            ['Charges', 'total_charges'],
                            ['Résultat', 'total_resultat'],
                            [
                              'Montant d’aides sur 3 ans',
                              'montant_aides_sur_3ans',
                            ],
                          ].map(([label, key]) => {
                            return [
                              <b>{label}</b>,
                              ...exerciceComptable.map((e) => e[key]),
                            ];
                          })}
                        />
                      </>
                    )}
                    <SimpleSeparator />
                  </div>
                </div>
              )}
            </div>,
          ]
        )}
      />
      <br />
      <br />
      <style jsx>{`
        .details-etablissement {
          position: relative;
        }

        .documents > div {
          display: none;
        }
        label {
          position: absolute;
          top: 0;
          right: 0;
          text-decoration: underline;
        }

        input[type='checkbox'] {
          display: none;
        }
        input[type='checkbox']:checked ~ div {
          display: block;
        }
        label.hide {
          display: none;
        }

        input[type='checkbox']:checked ~ label.show {
          display: none;
        }
        input[type='checkbox']:checked ~ label.hide {
          display: block;
        }

        @media only screen and (min-width: 1px) and (max-width: 992px) {
          label {
            display: none;
          }
          input[type='checkbox'] {
            display: none;
          }
          .documents > div {
            display: block;
          }
        }
      `}</style>
    </ProtectedSection>
  );
};
