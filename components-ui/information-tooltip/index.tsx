'use client';
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useId,
  useState,
} from 'react';
import style from './style.module.css';

type IProps = PropsWithChildren<{
  /**
   * The content of the tooltip
   * MUST NOT contain any interactive elements (like buttons or links) for accessibility reasons
   */
  label: string | ReactNode;
  orientation?: 'left' | 'right' | 'center';
  width?: number;
  inlineBlock?: boolean;
  left?: string;
  cursor?: 'help' | 'pointer' | 'auto';
  /**
   * The aria relation between the tooltip and the element it describes.
   * - 'labelledby' is used when the tooltip is a label for the element, and will replace the element's content (for instance when the element is an icon)
   *  - 'describedby' is used when the tooltip adds information to the element, it will be read after the element's content
   */
  ariaRelation?: 'describedby' | 'labelledby';
  /**
   * The tabIndex of the element, MUST BE SET to allow keyboard navigation (accessibility)
   * - to a number if the children is not focusable (like a div or a span), usually to 0
   * - to undefined if the children is focusable (like a button or a link)
   */
  tabIndex: number | undefined;
}>;

/**
 * Accessible tooltip component, following guidances from https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
function InformationTooltip({
  children,
  label,
  orientation = 'center',
  ariaRelation = 'describedby',
  width = 250,
  inlineBlock = true,
  left = '',
  cursor = 'auto',
  tabIndex,
}: IProps) {
  const id = useId();
  const {
    displayed,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
  } = useTooltipState();
  return (
    <>
      <span
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={style.wrapper}
        tabIndex={tabIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: cursor,
          display: inlineBlock ? 'inline-block' : 'block',
        }}
      >
        <span {...{ [`aria-${ariaRelation}`]: id }}>{children}</span>
        <div
          className={`${style.tooltip} ${style[orientation]} ${
            displayed ? style.displayed : ''
          }`}
          style={{
            width: `${width}px`,
            left: left || computeLeft(orientation, width),
            borderBottomRightRadius: orientation === 'right' ? '0' : '5px',
            borderBottomLeftRadius: orientation === 'left' ? '0' : '5px',
          }}
          id={id}
          role="tooltip"
        >
          {label}
        </div>
      </span>
    </>
  );
}
export default InformationTooltip;

const computeLeft = (orientation: 'left' | 'right' | 'center', width = 250) => {
  switch (orientation) {
    case 'right':
      return `calc(50% - ${width}px);`;
    case 'left':
      return `50%`;
    case 'center':
    default:
      return `calc(50% - ${Math.round(width / 2)}px)`;
  }
};

function useTooltipState() {
  const [displayedHover, setDisplayedHover] = useState(false);
  const [displayedFocus, setDisplayedFocus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDisplayedFocus(false);
        setDisplayedHover(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleFocus = () => setDisplayedFocus(true);
  const handleBlur = () => setDisplayedFocus(false);
  const handleMouseEnter = () => setDisplayedHover(true);
  const handleMouseLeave = () => setDisplayedHover(false);

  return {
    displayed: displayedFocus || displayedHover,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
  };
}
