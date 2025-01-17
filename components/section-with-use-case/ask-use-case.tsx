import { MultiChoice } from '#components-ui/multi-choice';
import { UseCase } from '#models/user/agent';

export function AskUseCase({
  useCase,
  setUseCase,
}: {
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
          idPrefix="user-type"
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
              onClick: () => setUseCase(UseCase.aidesEntreprises),
              checked: useCase === UseCase.aidesEntreprises,
            },
            {
              label: 'Aides publiques (aux associations)',
              onClick: () => setUseCase(UseCase.aidesAsso),
              checked: useCase === UseCase.aidesAsso,
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
