import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { meta } from '#components/meta/meta-server';

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
