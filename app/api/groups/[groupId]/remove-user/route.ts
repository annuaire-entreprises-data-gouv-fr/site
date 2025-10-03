import { NextResponse } from "next/server";
import getSession from "#utils/server-side-helper/app/get-session";
import { removeUserSchema } from "../../input-validation";
import { getGroup } from "../../route-helpers";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function removeUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const group = await getGroup(params);

  const body = await request.json();
  const validatedData = removeUserSchema.parse(body);

  await group.removeUserFromGroup(
    session!.user!.email,
    session!.user!.proConnectSub,
    validatedData.userEmail
  );

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(removeUserHandler));
