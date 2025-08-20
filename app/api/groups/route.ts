import { IRolesDataGroup } from '#models/authentication/group/groups';
import {
  Habilitation,
  HabilitationVerificationFailedException,
} from '#models/authentication/habilitation';
import getSession from '#utils/server-side-helper/app/get-session';
import { NextResponse } from 'next/server';
import { validateSchema } from './input-validation';
import { withAgentAuth, withErrorHandling } from './route-wrappers';

export interface ICreateRolesDataGroup {
  group: IRolesDataGroup | null;
  error: string | null;
}

async function createGroupHandler(request: Request) {
  try {
    const session = await getSession();

    const body = await request.json();
    const validatedData = validateSchema.parse(body);
    const user = 'robin.monnier@beta.gouv.fr';
    // const user = session!.user!.email;

    const { contractUrl, contractDescription, scopes, siret } =
      await Habilitation.verify(validatedData.demandeId, user);

    // const group = await Groups.create(
    //   session!.user!.email,
    //   session!.user!.proConnectSub,
    //   validatedData.groupName,
    //   validatedData.emails || [],
    //   contractUrl,
    //   contractDescription,
    //   scopes,
    //   siret
    // );

    return NextResponse.redirect(
      `/compte/habilitation/${validatedData.demandeId}/succes`
    );
  } catch (error) {
    if (error instanceof HabilitationVerificationFailedException) {
      return NextResponse.json({
        group: null,
        error: error.message,
      } as ICreateRolesDataGroup);
    }
    throw error;
  }
}

export const POST = withAgentAuth(withErrorHandling(createGroupHandler));
