import { NextResponse } from "next/server";
import { HttpNotFound } from "#clients/exceptions";
import { getAgentGroups } from "#models/authentication/group";
import getSession from "#utils/server-side-helper/app/get-session";
import { removeUserSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function removeUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = (await params).groupId;
  const agentGroups = await getAgentGroups();
  const group = agentGroups.find(
    (group) => group.group.id.toString() === groupId
  );

  if (!group) {
    throw new HttpNotFound("Group does not exist or user not in group");
  }

  const session = await getSession();
  const body = await request.json();
  const validatedData = removeUserSchema.parse(body);

  await group.removeUserFromGroup(session!.user!.email, validatedData.userId);

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(removeUserHandler));
