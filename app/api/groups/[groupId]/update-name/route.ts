import { NextResponse } from "next/server";
import { AgentsGroup } from "#models/authentication/group";
import { updateNameSchema } from "../../input-validation";
import { withAgentAuth, withErrorHandling } from "../../route-wrappers";

async function updateNameHandler(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const groupId = Number.parseInt((await params).groupId, 10);
  const body = await request.json();
  const validatedData = updateNameSchema.parse(body);

  await AgentsGroup.updateGroupName(groupId, validatedData.groupName);

  return NextResponse.json({ success: true });
}

export const POST = withAgentAuth(withErrorHandling(updateNameHandler));
