import { NextResponse } from "next/server";
import { AgentsGroup } from "#models/authentication/group";
import { removeUserSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function removeUserHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = Number.parseInt((await params).groupId, 10);
  const body = await request.json();
  const validatedData = removeUserSchema.parse(body);

  await AgentsGroup.removeUserFromGroup(groupId, validatedData.userId);

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(removeUserHandler));
