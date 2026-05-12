export const formatLog = (
  url: string,
  status: number,
  time: number | undefined,
  method: string,
  userAgent: string,
  requestId: string
) =>
  [
    ["status", status],
    ["time", time ?? -1],
    ["request", url],
    ["method", method],
    ["userAgent", userAgent],
    ["requestId", requestId],
  ]
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
