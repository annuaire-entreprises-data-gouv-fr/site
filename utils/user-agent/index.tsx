import crawlers from 'crawler-user-agents';
import { Exception } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

const isUserAgentABot = (userAgent: string) => {
  if (!userAgent) {
    return false;
  }
  /**
   * Exclude Uptime robot as we want uptime robot to test human-website first
   * To test bot-website, use param &isABot=true
   * */
  if (
    userAgent.indexOf('uptimerobot') > -1 ||
    userAgent.indexOf('UptimeRobot') > -1
  ) {
    return false;
  }

  try {
    return crawlers.some((crawler) => {
      return (
        RegExp(crawler.pattern).test(userAgent) ||
        RegExp(crawler.pattern.toLocaleLowerCase()).test(userAgent)
      );
    });
  } catch (e: any) {
    logWarningInSentry(
      new Exception({ name: 'UserAgentParsingException', cause: e })
    );
    return false;
  }
};
export default isUserAgentABot;
