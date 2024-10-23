import { parseIntWithDefaultValue } from '#utils/helpers';
import isUserAgentABot from '#utils/user-agent';
import { headers } from 'next/headers';

export type IParams = { slug: string };

export type AppRouterProps = {
  params: Promise<IParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function extractParamsAppRouter({
  params,
  searchParams,
}: Partial<AppRouterProps>) {
  const resolvedParams = await params;
  const slug = (resolvedParams?.slug || '') as string;

  const resolvedSearchParams = (await searchParams) || {};
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  // cf middleware
  const isRedirected = headersList.get('x-redirected') === '1';

  const pageParam = (resolvedSearchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);

  const isABotParam = (resolvedSearchParams.isABot || '') as string;
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
