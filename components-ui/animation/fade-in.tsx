type IProps = {
  duration?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const FadeIn = ({
  duration = 400,
  delay = 0,
  children,
  style,
  className,
}: IProps) => {
  return (
    <>
      <div
        className={(className ? className : '') + ' ' + 'fade-in-wrapper'}
        style={{
          ...(style || {}),
          animationDuration: duration + 'ms',
          animationDelay: delay + 'ms',
        }}
      >
        {children}
      </div>
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .fade-in-wrapper {
            will-change: opacity, transform;
            animation-name: fadeInAnimation;
            animation-fill-mode: backwards;
            animation-easing-function: ease-in-out;
          }
        }
        @keyframes fadeInAnimation {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
export default FadeIn;
