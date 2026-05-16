import { createIsomorphicFn } from "@tanstack/react-start";
import { randomIdServer } from "./random-id.server";

export const randomId = createIsomorphicFn()
  .server(() => randomIdServer())
  .client(() => window.crypto.randomUUID().slice(0, 8));
