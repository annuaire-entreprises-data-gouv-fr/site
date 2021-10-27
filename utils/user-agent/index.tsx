import { IncomingMessage } from 'http';
import crawlers from 'crawler-user-agents';

const isUserAgentABot = (req: IncomingMessage) => {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return false;
  }
  // whitelist Uptime robot
  if (RegExp('UptimeRobot').test(userAgent)) {
    return true;
  }

  return crawlers.some((crawler) => RegExp(crawler.pattern).test(userAgent));
};

export default isUserAgentABot;
