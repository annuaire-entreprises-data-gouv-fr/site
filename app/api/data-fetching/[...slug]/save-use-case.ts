import { Exception } from '#models/exceptions';
import { UseCase } from '#models/user/agent';
import { setAgentUseCase } from '#models/user/helpers';
import getSession from '#utils/server-side-helper/app/get-session';

export default async function saveAgentUseCase(useCase: string) {
  if (!Object.values(UseCase).includes(useCase as UseCase)) {
    throw new Exception({
      name: 'SaveAgentUseCaseException',
      message: 'Invalid use case',
    });
  }

  let session = await getSession();

  if (!session) {
    throw new Exception({
      name: 'SaveAgentUseCaseException',
      message: 'Session not found',
    });
  }

  session = setAgentUseCase(useCase as UseCase, session);
  await session.save();
  return useCase as UseCase;
}
