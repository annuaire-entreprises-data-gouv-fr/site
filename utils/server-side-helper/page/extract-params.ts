import { GetServerSidePropsContext } from 'next';
import { parseIntWithDefaultValue } from '#utils/helpers';
import isUserAgentABot from '#utils/user-agent';

const extractParamsPageRouter = (context: GetServerSidePropsContext) => {
  const slug = (context?.params?.slug || '') as string;

  const pageParam = (context?.query?.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (context?.query?.isABot || '') as string;
  const isABotUA = isUserAgentABot(context?.req?.headers['user-agent'] || '');

  const isBot = !!isABotParam || isABotUA;

  return {
    slug,
    page,
    isBot,
  };
};

export default extractParamsPageRouter;
