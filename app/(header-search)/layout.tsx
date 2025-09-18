import { Question } from '#components/question';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Question />
    </>
  );
};

export default HomeLayout;
