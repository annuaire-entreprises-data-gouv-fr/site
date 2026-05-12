import { createServerFn } from "@tanstack/react-start";
import { getCurrentSession } from "#/utils/session";

export const getCurrentUserFn = createServerFn().handler(async () => {
  const session = await getCurrentSession();

  return session?.data.user || null;
});
