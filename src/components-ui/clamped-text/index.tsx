import clsx from "clsx";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import styles from "./style.module.css";

const DEFAULT_MAX_LINES = 8;

interface IProps {
  children: React.ReactNode;
  maxLines?: number;
}

/*

Clamps its children to `maxLines` lines and displays a « Voir plus » button
when—and only when—the text is actually cut off. The full text stays in the DOM,
so it remains accessible to screen readers and to print.

*/

export default function ClampedText({
  children,
  maxLines = DEFAULT_MAX_LINES,
}: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const id = useId();

  useEffect(() => {
    const content = contentRef.current;
    // While expanded the text is not clamped anymore: keep the button visible
    // so the reader can collapse it back.
    if (!content || isExpanded) {
      return;
    }
    const checkIsClamped = () => {
      setIsClamped(content.scrollHeight > content.clientHeight + 1);
    };
    checkIsClamped();
    // The number of lines depends on the available width
    const observer = new ResizeObserver(checkIsClamped);
    observer.observe(content);
    return () => observer.disconnect();
  }, [isExpanded]);

  return (
    <div className={styles.container}>
      <p
        className={clsx(styles.content, !isExpanded && styles.clamped)}
        id={id}
        ref={contentRef}
        style={{ "--max-lines": maxLines } as CSSProperties}
      >
        {children}
      </p>
      {isClamped && (
        <button
          aria-controls={id}
          aria-expanded={isExpanded}
          className={styles.button}
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          {isExpanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
