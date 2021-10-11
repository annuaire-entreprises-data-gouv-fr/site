import { IncomingMessage } from 'http';
import crawlers from 'crawler-user-agents';

const checkUserAgentIsABot = (req: IncomingMessage) => {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return false;
  }
  for (let i = 0; i < crawlers.length; i++) {
    if (RegExp(crawlers[i].pattern).test(userAgent)) {
      return true;
    }
  }
  return false;
};

export default checkUserAgentIsABot;
