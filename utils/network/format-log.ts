export const formatLog = (
  url: string,
  status: number,
  isFromCached = false,
  time = -1
) => {
  return `status=${status} time=${time} isFromCached=${isFromCached} request=${url}`;
};
