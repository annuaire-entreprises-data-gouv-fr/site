import { Metadata } from 'next';
import { meta } from '#components/meta/meta-server';
import getSession from '#utils/server-side-helper/app/get-session';
import QuestionOrFeedback from 'app/_component/question-or-feedback';

export const metadata: Metadata = meta({});

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      {children}
      <QuestionOrFeedback session={session} />
    </>
  );
}
