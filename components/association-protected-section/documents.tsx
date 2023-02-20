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

export const AssociationDocumentSection = ({
  subventionsDocuments,
}: ISubventionsAssociation) => {
  if (isAPINotResponding(subventionsDocuments)) {
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
      <FullTable
        head={['Siret', 'Adresse', 'Documents de l’établissement']}
        body={subventionsDocuments.dac.map(
          ({
            siret,
            adresse,
            estSiege,
            comptes,
            rapportFinancier,
            rapportActivite,
            exerciceComptable,
          }) => [
            <a href={`/etablissement/${siret}`}>{siret}</a>,
            <>
              {adresse}
              {estSiege ? <Tag color="info">siège social</Tag> : null}
            </>,
            <>
              {comptes.length === 0 &&
              rapportActivite.length === 0 &&
              rapportFinancier.length === 0 &&
              exerciceComptable.length === 0 ? (
                <i>Aucun document n’a été déclaré pour cet établissement.</i>
              ) : null}
              <DocumentList documentList={comptes} label="Comptes" />
              <DocumentList
                documentList={rapportFinancier}
                label="Rapport financier"
              />
              <DocumentList
                documentList={rapportActivite}
                label="Rapport d’activité"
              />
              <DocumentList
                documentList={exerciceComptable}
                label="Exercice comptable"
              />
            </>,
          ]
        )}
      />
      <br />
      <br />
    </ProtectedSection>
  );
};
