import { ProtectedData } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import { ISession } from '#models/user/session';

export default function ResetUseCase({
  session,
  onUseCaseReset,
}: {
  session: ISession | null;
  onUseCaseReset: () => void;
}) {
  return (
    <ProtectedData>
      <h3>
        L’accès à cette donnée est <strong>encadré par la loi</strong>
      </h3>
      <p>
        Vous avez déclaré nécessiter l’accès à ces données dans le cadre de la
        mission « <strong>{session!.user!.useCase}</strong> ».
      </p>
      <p>
        Si cette mission n’est plus d’actualité,{' '}
        <strong>vous êtes dans l’obligation de le signaler</strong>,
        conformément <a href="/cgu">aux conditions générales d’utilisations</a>.
      </p>{' '}
      <p>
        <ButtonLink onClick={onUseCaseReset}>Changer la mission</ButtonLink>
      </p>
    </ProtectedData>
  );
}
