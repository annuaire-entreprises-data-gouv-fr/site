import { MultiChoice } from '#components-ui/multi-choice';
import { UseCase } from '#models/user/agent';

export function AskUseCase({
  useCase,
  setUseCase,
  allowedUseCases,
  introContent,
}: {
  useCase?: UseCase;
  setUseCase: (useCase: UseCase) => void;
  allowedUseCases: UseCase[];
  introContent?: React.ReactNode;
}) {
  if (!useCase) {
    return (
      <>
        {introContent ? introContent : null}
        <form>
          <label>Dans quel cadre souhaitez-vous accéder à ces données ?</label>
          <br />
          <MultiChoice
            idPrefix="user-type"
            values={[
              {
                label: 'Aides publiques',
                onClick: () => setUseCase(UseCase.aides),
                checked: useCase === UseCase.aides,
              },
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
                label: 'Autre cas d’usage',
                onClick: () => setUseCase(UseCase.autre),
                checked: useCase === UseCase.autre,
              },
            ]}
          />
        </form>
      </>
    );
  } else if (allowedUseCases.includes(useCase)) {
    return (
      <strong>
        Ces informations ne vous sont pas accessibles dans ce cas d‘usage.
      </strong>
    );
  } else {
    return (
      <strong>
        Vous avez accès à ces informations strictement dans le cas d‘usage
        déclaré.
      </strong>
    );
  }
}
