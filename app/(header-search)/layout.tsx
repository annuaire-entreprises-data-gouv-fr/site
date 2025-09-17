import { Question } from "#components/question";

const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Question />
  </>
);

export default HomeLayout;
