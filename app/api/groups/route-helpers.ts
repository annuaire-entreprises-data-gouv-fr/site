import { Group } from "#models/authentication/group";
import { groupIdParamSchema } from "./input-validation";

export async function getGroup(params: Promise<{ groupId: string }>) {
  const { groupId } = await params;
  const validatedParams = groupIdParamSchema.parse({ groupId });
  return new Group(validatedParams.groupId);
}
