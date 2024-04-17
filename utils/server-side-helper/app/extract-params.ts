import { headers } from 'next/headers';
import { parseIntWithDefaultValue } from '#utils/helpers';
import isUserAgentABot from '#utils/user-agent';

export type AppRouterProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function extractParamsAppRouter<T>({ params, searchParams }: AppRouterProps) {
  const slug = (params?.slug || '') as string;

  searchParams = searchParams ?? {};
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';

  // cf middleware
  const isRedirected = headersList.get('x-redirected') === '1';

  const pageParam = (searchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (searchParams.isABot || '') as string;
  const isABotUA = isUserAgentABot(userAgent);

  const isBot = !!isABotParam || isABotUA;

  return {
    isRedirected,
    page,
    isBot,
    slug,
  };
}

export default extractParamsAppRouter;
