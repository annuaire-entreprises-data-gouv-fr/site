import { Groups } from '#models/authentication/group/groups';
import {
  Habilitation,
  HabilitationVerificationFailedException,
} from '#models/authentication/habilitation';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';
import { validateSchema } from './input-validation';
import { withAgentAuth, withErrorHandling } from './route-wrappers';

export interface ICreateRolesDataGroup {
  newScopes: string;
  error: string | null;
}

async function createGroupHandler(request: Request) {
  try {
    const session = await getSession();

    const body = await request.json();
    const validatedData = validateSchema.parse(body);
    const user = session!.user!.email;

    const { contractUrl, contractDescription, scopes, siret } =
      await Habilitation.verify(validatedData.demandeId, user);

    const serializedScopes = scopes.join(' ');

    await Groups.create(
      session!.user!.email,
      session!.user!.proConnectSub,
      validatedData.groupName,
      validatedData.emails || [],
      contractUrl,
      contractDescription,
      serializedScopes,
      siret
    );

    return NextResponse.json({ newScopes: serializedScopes, error: null });
  } catch (error) {
    if (error instanceof HabilitationVerificationFailedException) {
      return NextResponse.json({
        newScopes: '',
        error: error.message,
      } as ICreateRolesDataGroup);
    }
    throw error;
  }
}

export const POST = withAgentAuth(withErrorHandling(createGroupHandler));
