export const formatLog = (
  url: string,
  status: number,
  time = -1,
  method: string
) => `status=${status} time=${time} request=${url} method=${method}`;
