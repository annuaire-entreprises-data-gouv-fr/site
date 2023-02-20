import ButtonLink from '#components-ui/button';
import AdministrationNotResponding from '#components/administration-not-responding';
import { ProtectedSection } from '#components/section/protected-section';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { ISubventionsAssociation } from '#models/espace-agent/subventions-association';

export const AssociationStatutsSection = ({
  subventionsDocuments,
}: ISubventionsAssociation) => {
  if (isAPINotResponding(subventionsDocuments)) {
    return (
      <AdministrationNotResponding
        administration={subventionsDocuments.administration}
        errorType={subventionsDocuments.errorType}
        title="Statuts"
      />
    );
  }

  return (
    <ProtectedSection title="Statuts" sources={[EAdministration.MI]}>
      <p>
        Les statuts les plus récents pour cette association datent de{' '}
        {subventionsDocuments.statuts.annee} :
      </p>
      <div className="layout-center">
        <ButtonLink to={subventionsDocuments.statuts.url} target="_blank">
          Télécharger les statuts {subventionsDocuments.statuts.annee}
        </ButtonLink>
      </div>
    </ProtectedSection>
  );
};
