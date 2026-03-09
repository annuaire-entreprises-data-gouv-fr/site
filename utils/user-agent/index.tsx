import crawlers from "crawler-user-agents";
import { Exception } from "#models/exceptions";
import { logWarningInSentry } from "#utils/sentry";

const isUserAgentABot = (userAgent: string) => {
  if (!userAgent) {
    return false;
  }

  try {
    return crawlers.some(
      (crawler) =>
        new RegExp(crawler.pattern).test(userAgent) ||
        new RegExp(crawler.pattern.toLocaleLowerCase()).test(userAgent)
    );
  } catch (e: any) {
    logWarningInSentry(
      new Exception({ name: "UserAgentParsingException", cause: e })
    );
    return false;
  }
};
export default isUserAgentABot;
