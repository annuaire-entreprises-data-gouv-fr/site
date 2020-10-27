import { ServerResponse } from 'http';

export default (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};
