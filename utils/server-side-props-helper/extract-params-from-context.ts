import { GetServerSidePropsContext } from 'next';
import { parseIntWithDefaultValue } from '../helpers/formatting';
import isUserAgentABot from '../user-agent';

const extractParamsFromContext = (
  context: GetServerSidePropsContext,
  allParams = false
) => {
  const slug = (context?.params?.slug || '') as string;

  if (!allParams) {
    return { slug };
  }

  const referer = context?.req?.headers?.referer;
  const isRedirected = !!referer && !!context.query.redirected;

  const pageParam = (context?.query?.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (context?.query?.isABot || '') as string;
  const isABotUA = isUserAgentABot(context.req);

  console.log(context.req.headers['user-agent'], isABotUA);

  const isBot = !!isABotParam || isABotUA;
  return {
    slug,
    isRedirected,
    page,
    isBot,
  };
};

export default extractParamsFromContext;
