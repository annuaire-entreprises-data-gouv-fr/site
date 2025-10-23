import { NextResponse } from "next/server";
import { HttpNotFound } from "#clients/exceptions";
import { getAgentGroups } from "#models/authentication/group";
import getSession from "#utils/server-side-helper/app/get-session";
import { updateUserSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function updateUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = (await params).groupId;
  const agentGroups = await getAgentGroups();
  const group = agentGroups.find(
    (group) => group.group.id.toString() === groupId
  );

  if (!group) {
    throw new HttpNotFound("Group or user does not exist");
  }

  const session = await getSession();
  const body = await request.json();
  const validatedData = updateUserSchema.parse(body);

  const user = await group.updateUserRoleInGroup(
    session!.user!.email,
    validatedData.userId,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(updateUserHandler));
