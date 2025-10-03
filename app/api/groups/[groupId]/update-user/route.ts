import { NextResponse } from "next/server";
import getSession from "#utils/server-side-helper/app/get-session";
import { updateUserSchema } from "../../input-validation";
import { getGroup } from "../../route-helpers";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function updateUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const group = await getGroup(params);

  const body = await request.json();
  const validatedData = updateUserSchema.parse(body);

  const user = await group.updateUser(
    session!.user!.email,
    session!.user!.proConnectSub,
    validatedData.userEmail,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(updateUserHandler));
