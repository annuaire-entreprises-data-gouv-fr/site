import { MultiChoice } from '#components-ui/multi-choice';
import { UseCase } from '#models/user/agent';

export function AskUseCase({
  useCase,
  setUseCase,
  introContent,
}: {
  useCase?: UseCase;
  setUseCase: (useCase: UseCase) => void;
  introContent?: React.ReactNode;
}) {
  const defaultIntroContent = (
    <p>
      Les agents publics peuvent demander accéder à cette donnée uniquement dans
      les cas d’usages justifiant d’un intérêt légitime. En déclarant le cadre
      juridique dans lequel vous accédez à ces données, vous vous engagez{' '}
      <a href="/cgu">à respecter nos conditions générales d’utilisation</a>.
    </p>
  );
  return (
    <>
      {introContent || defaultIntroContent}
      <form>
        <label>Dans quel cadre souhaitez-vous accéder à ces données ?</label>
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
