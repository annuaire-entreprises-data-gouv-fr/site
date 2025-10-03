import { NextResponse } from "next/server";
import getSession from "#utils/server-side-helper/app/get-session";
import { addUserSchema } from "../../input-validation";
import { getGroup } from "../../route-helpers";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function addUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const group = await getGroup(params);

  const body = await request.json();
  const validatedData = addUserSchema.parse(body);

  const user = await group.addUser(
    session!.user!.email,
    session!.user!.proConnectSub,
    validatedData.userEmail,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(addUserHandler));
