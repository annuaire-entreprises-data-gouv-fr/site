import { headers } from 'next/headers';
import isUserAgentABot from '#utils/user-agent';

export const isABot = () => {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  return isUserAgentABot(userAgent);
};
