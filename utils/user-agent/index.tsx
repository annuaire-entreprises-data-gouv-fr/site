import { IncomingMessage } from 'http';
import crawlers from 'crawler-user-agents';

const isUserAgentABot = (req: IncomingMessage) => {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return false;
  }
  return crawlers.some((crawler) => RegExp(crawler.pattern).test(userAgent));
};

export default isUserAgentABot;
