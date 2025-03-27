import { MultiChoice } from '#components-ui/multi-choice';
import { UseCase } from '#models/use-cases';

export function AskUseCase({
  idPrefix,
  useCase,
  setUseCase,
}: {
  idPrefix: string;
  useCase?: UseCase;
  setUseCase: (useCase: UseCase) => void;
}) {
  return (
    <>
      <form>
        <label>
          Dans quel cadre juridique souhaitez-vous accéder à ces données ?
        </label>
        <br />
        <MultiChoice
          idPrefix={`${idPrefix}-use-case`}
          values={[
            {
              label: 'Marchés publics',
              onClick: () => setUseCase(UseCase.marches),
              checked: useCase === UseCase.marches,
            },
            {
              label: 'Lutte contre la fraude',
              onClick: () => setUseCase(UseCase.fraude),
              checked: useCase === UseCase.fraude,
            },
            {
              label: 'Aides publiques (aux entreprises)',
              onClick: () => setUseCase(UseCase.aidesPubliques),
              checked: useCase === UseCase.aidesPubliques,
            },
            {
              label: 'Aides publiques (aux associations)',
              onClick: () =>
                setUseCase(UseCase.subventionsFonctionnementAssociation),
              checked: useCase === UseCase.subventionsFonctionnementAssociation,
            },
            {
              label: 'Autre cas d’usage',
              onClick: () => setUseCase(UseCase.autre),
              checked: useCase === UseCase.autre,
            },
          ]}
        />
      </form>
    </>
  );
}
