import { MultiChoice } from '#components-ui/multi-choice';
import { UseCase } from '#models/user/agent';
import { useState } from 'react';

export function AskUseCase({
  onUseCaseChanged,
}: {
  onUseCaseChanged: (useCase: UseCase) => void;
}) {
  const [useCase, setUseCase] = useState<UseCase>();
  function saveUseCase(useCase: UseCase) {
    setUseCase(useCase);
    onUseCaseChanged(useCase);
  }
  return (
    <>
      <form>
        <label>Dans quel cadre souhaitez-vous accéder à ces données ?</label>
        <br />
        <MultiChoice
          idPrefix="user-type"
          values={[
            {
              label: 'Aides publiques',
              onClick: () => saveUseCase(UseCase.aides),
              checked: useCase === UseCase.aides,
            },
            {
              label: 'Marchés publics',
              onClick: () => saveUseCase(UseCase.marches),
              checked: useCase === UseCase.marches,
            },
            {
              label: 'Lutte contre la fraude',
              onClick: () => saveUseCase(UseCase.fraude),
              checked: useCase === UseCase.fraude,
            },
            {
              label: 'Autre cas d’usage',
              onClick: () => saveUseCase(UseCase.autre),
              checked: useCase === UseCase.autre,
            },
          ]}
        />
      </form>
    </>
  );
}
