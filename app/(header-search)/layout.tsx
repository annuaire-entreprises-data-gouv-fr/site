import type { Metadata } from "next";
import { meta } from "#components/meta/meta-server";
import { Question } from "#components/question";

export const metadata: Metadata = meta({});

const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Question />
  </>
);

export default HomeLayout;
