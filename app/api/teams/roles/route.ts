import { getRoles } from '#clients/api-d-roles';
import { NextResponse } from 'next/server';
import { withAgentAuth, withHandleError } from '../with-agent-auth';

async function getRolesHandler() {
  const roles = await getRoles();
  return NextResponse.json(roles);
}

export const GET = withAgentAuth(withHandleError(getRolesHandler));
