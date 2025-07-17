import { getRoles } from '#clients/api-d-roles';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { NextResponse } from 'next/server';
import { withAgentAuth } from '../with-agent-auth';

async function getRolesHandler() {
  try {
    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch (error) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'Get Available Roles',
        cause: error,
      })
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAgentAuth(getRolesHandler);
