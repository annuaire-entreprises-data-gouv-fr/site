import { clsx } from "clsx";

interface IProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const FadeIn = ({
  duration = 400,
  delay = 0,
  children,
  style,
  className,
}: IProps) => (
  <>
    <div
      className={clsx(className, "fade-in-wrapper")}
      style={{
        ...(style || {}),
        animationDuration: duration + "ms",
        animationDelay: delay + "ms",
      }}
    >
      {children}
    </div>
  </>
);
export default FadeIn;
