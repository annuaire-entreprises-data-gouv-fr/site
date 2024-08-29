import { useEffect } from 'react';
import { isDataSuccess } from '#models/data-fetching';
import { UseCase } from '#models/user/agent';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from './fetch/use-API-route-data';

/**
 * This hook is used to store the use case of an agent accessing sensitive data
 *
 * The use case is stored in the session, through a call to the API.
 * It then changes in place the session object to add the use case.
 */
export default function useSaveUseCase(
  useCase: UseCase,
  session: ISession | null
) {
  // TODO : add a route to save usecase in session
  const response = useAPIRouteData(
    'espace-agent/save-use-case',
    useCase,
    session
  );
  useEffect(() => {
    if (session?.user && isDataSuccess(response)) {
      session.user.useCase = useCase;
    }
  }, [response, session, useCase]);
}
