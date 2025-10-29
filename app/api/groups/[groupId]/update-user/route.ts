import { NextResponse } from "next/server";
import { updateUserRoleInGroup } from "#models/authentication/group";
import { updateUserSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function updateUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = Number.parseInt((await params).groupId, 10);
  const body = await request.json();
  const validatedData = updateUserSchema.parse(body);

  const user = await updateUserRoleInGroup(
    groupId,
    validatedData.userId,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(updateUserHandler));
