import z from "zod";

export const queryString = z.union([z.string(), z.number()]).transform(String);
