import { IDataFetchingState } from "#models/data-fetching";

export function convertErrorToFetchingState(errorCode: number | null) {
  if (errorCode && [408, 504, 401].includes(errorCode)) {
    return IDataFetchingState.CONNECTIVITY_ERROR;
  }

  if (errorCode === 432) {
    return IDataFetchingState.AGENT_OVER_RATE_LIMITS;
  }

  if (errorCode === 429) {
    return IDataFetchingState.TOO_MANY_REQUESTS;
  }

  return IDataFetchingState.MODEL_ERROR;
}
