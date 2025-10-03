import getSession from "#utils/server-side-helper/app/get-session";
import { NextResponse } from "next/server";
import { updateNameSchema } from "../../input-validation";
import { getGroup } from "../../route-helpers";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function updateNameHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getSession();
  const group = await getGroup(params);

  const body = await request.json();
  const validatedData = updateNameSchema.parse(body);

  await group.updateName(
    session!.user!.email,
    session!.user!.proConnectSub,
    validatedData.groupName
  );

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(updateNameHandler));
