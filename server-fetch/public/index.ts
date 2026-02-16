import { getAssociationFromSlug } from "#models/association";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { createPublicFetcher } from "./middlewares";

export const getRNEObservationsFetcher =
  createPublicFetcher(getRNEObservations).build();

export const getDirigeantsRNEFetcher =
  createPublicFetcher(getDirigeantsRNE).build();

export const getAssociationFromSlugFetcher = createPublicFetcher(
  getAssociationFromSlug
).build();
