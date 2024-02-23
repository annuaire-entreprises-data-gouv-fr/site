'use client';
import { createRef, useState } from 'react';
import { InternalError } from '#models/exceptions';
import style from './copy-paste.module.css';

type ICopyPasteProps = {
  shouldTrim?: boolean;
  id?: string;
  children: string;
};

export function CopyPaste({
  children,
  shouldTrim = false,
  id = undefined,
}: ICopyPasteProps) {
  if (typeof children !== 'string') {
    throw new InternalError({
      message: `CopyPaste component can only be used with string children, got ${typeof children}`,
    });
  }
  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = shouldTrim ? children.trim() : children;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    element.current?.focus();
  };
  const element = createRef<HTMLButtonElement>();

  const handleBlur = () => {
    setFocused(false);
    setCopied(false);
  };
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <button
      className={style.copyButton}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      ref={element}
      onClick={copyToClipboard}
      aria-label={`${children}, copier dans le presse-papier`}
      title="Copier dans le presse-papier"
    >
      <span id={id}>{children}</span>{' '}
      {(hovered || copied || focused) && (
        <span
          className={style.copyTooltip}
          aria-hidden
          style={{ color: copied ? 'green' : '' }}
        >
          {copied ? (
            <>
              <CheckMarkSVG /> copié
            </>
          ) : (
            <>
              <CopySVG /> copier
            </>
          )}
        </span>
      )}
    </button>
  );
}

function CopySVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  );
}

function CheckMarkSVG() {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width="15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="2"
      height="15px"
    >
      <path d="M4 16L11 23 27 7" />
    </svg>
  );
}
