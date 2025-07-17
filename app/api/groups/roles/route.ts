import { getRoles } from '#clients/api-d-roles';
import { NextResponse } from 'next/server';
import { withAgentAuth, withErrorHandling } from '../route-wrappers';

async function getRolesHandler() {
  const roles = await getRoles();
  return NextResponse.json(roles);
}

export const GET = withAgentAuth(withErrorHandling(getRolesHandler));
