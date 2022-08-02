export const formatLog = (
  url: string,
  status: number,
  isFromCached = false,
  time = -1
) => {
  // see https://medium.com/trabe/detecting-node-js-active-handles-with-wtfnode-704e91f2b120

  //@ts-ignore
  const reqCount = process._getActiveRequests().length;
  //@ts-ignore
  const handleCount = process._getActiveHandles().length;
  return `status=${status} time=${time} isFromCached=${isFromCached} handleCount=${handleCount} reqCount=${reqCount} request=${url}`;
};
