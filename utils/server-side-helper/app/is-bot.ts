import isUserAgentABot from '#utils/user-agent';
import { headers } from 'next/headers';

export const isABot = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  return isUserAgentABot(userAgent);
};
