import { meta } from "#components/meta/meta-server";
import { Question } from "#components/question";
import type { Metadata } from "next";

export const metadata: Metadata = meta({});

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Question />
    </>
  );
};

export default HomeLayout;
