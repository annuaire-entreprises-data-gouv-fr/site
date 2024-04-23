import { redirect } from 'next/navigation';
import { Exception } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

export const redirectFAQPageNotFound = (slug: string) => {
  logWarningInSentry(
    new Exception({
      name: 'FAQPageNotFound',
      context: { slug },
    })
  );
  redirect('/404');
};
