import { randomUUID } from "node:crypto";

export const randomIdServer = () => randomUUID().slice(0, 8);
