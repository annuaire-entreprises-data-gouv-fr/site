import { getRNEObservations } from "#models/rne/observations";
import { createPublicFetcher } from "./middlewares";

export const getRNEObservationsFetcher =
  createPublicFetcher(getRNEObservations).build();
