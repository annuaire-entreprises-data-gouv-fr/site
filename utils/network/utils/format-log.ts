export const formatLog = (
  url: string,
  status: number,
  isFromCached = false,
  time = -1,
  method: string
) => {
  return `status=${status} time=${time} isFromCached=${isFromCached} request=${url} method=${method}`;
};
