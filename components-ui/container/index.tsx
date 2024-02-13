import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * This container is used to wrap the main content of the page
 *
 * It can be wrapped inside another container to create a nested container, with a different style (usually, a container with a different background color)
 *
 */
export default function Container({
  children,
  style = {},
  className = '',
}: ContainerProps) {
  return (
    <>
      <div className="outer-outer-container">
        <div className={`${className} outer-container`} style={style}>
          <div className="fr-container">{children}</div>
        </div>
      </div>
      <style jsx>{`
        .outer-outer-container {
          display: flex;
          flex: 1 1 0%;
          justify-content: center;
        }
        .outer-container {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          min-width: 100vw;
        }
        .fr-container {
        }
      `}</style>
    </>
  );
}
