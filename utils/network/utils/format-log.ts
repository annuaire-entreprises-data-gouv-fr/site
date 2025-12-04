export const formatLog = (
  url: string,
  status: number,
  time = -1,
  method: string,
  userAgent: string,
  requestId: string
) =>
  [
    ["status", status],
    ["time", time],
    ["request", url],
    ["method", method],
    ["userAgent", userAgent],
    ["requestId", requestId],
  ]
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
