import { meta } from '#components/meta/meta-server';
import { Question } from '#components/question';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Question />
    </>
  );
}
