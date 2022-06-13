export const formatLog = (
  url: string,
  status: number,
  isFromCached: boolean
) => {
  return `status=${status} isFromCached=${isFromCached} request=${url}`;
};
