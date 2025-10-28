import { NextResponse } from "next/server";
import { addUserToGroup } from "#models/authentication/group";
import { addUserSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function addUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = Number.parseInt((await params).groupId, 10);
  const body = await request.json();
  const validatedData = addUserSchema.parse(body);

  const user = await addUserToGroup(
    groupId,
    validatedData.userEmail,
    validatedData.roleId
  );

  return NextResponse.json(user);
}

export const POST = withAgentAuth(withErrorHandling(addUserHandler));
