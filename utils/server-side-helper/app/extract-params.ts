import { headers } from 'next/headers';
import { parseIntWithDefaultValue } from '#utils/helpers';
import isUserAgentABot from '#utils/user-agent';

export type AppRouterProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const extractParamsAppRouter = ({
  params,
  searchParams,
}: Partial<AppRouterProps>) => {
  const slug = (params?.slug || '') as string;
  searchParams = searchParams ?? {};
  const headersList = headers();
  const referer = headersList.get('referer') && '';
  const userAgent = headersList.get('user-agent') || '';

  const isRedirected = !!referer && !!searchParams.redirected;

  const pageParam = (searchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (searchParams.isABot || '') as string;
  const isABotUA = isUserAgentABot(userAgent);

  const isBot = !!isABotParam || isABotUA;

  return {
    slug,
    isRedirected,
    page,
    isBot,
  };
};

export default extractParamsAppRouter;
