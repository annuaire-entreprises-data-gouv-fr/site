'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { InternalError } from '#models/exceptions';
import style from './copy-paste.module.css';

type ICopyPasteProps = {
  shouldRemoveSpace?: boolean;
  id?: string;
  children: string;
  label: string;
};

export function CopyPaste({
  children,
  shouldRemoveSpace = false,
  id = undefined,
  label,
}: ICopyPasteProps) {
  if (typeof children !== 'string') {
    throw new InternalError({
      message: `CopyPaste component can only be used with string children, got ${typeof children}`,
    });
  }

  const timeoutId = useRef<NodeJS.Timeout>();

  const copyToClipboard = (e: any) => {
    const el = document.createElement('textarea');
    el.value = shouldRemoveSpace ? children.replace(/\s/g, '') : children;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);

    const isKeyboardNavigation = e.detail === 0;
    if (isKeyboardNavigation) {
      element.current?.focus();
    }
    logCopyPaste(label);
    timeoutId.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const element = useRef<HTMLButtonElement>(null);

  const handleBlur = () => {
    setFocused(false);
    setCopied(false);
    clearTimeout(timeoutId.current);
  };
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
  const copyTooltipRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (copyTooltipRef.current && copyTooltipRef.current.offsetTop > 0) {
      copyTooltipRef.current.classList.add(style.copyTooltipAbsolute);
    }
  });

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
          ref={copyTooltipRef}
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

function logCopyPaste(label: string) {
  try {
    var _paq = window._paq || [];
    _paq.push(['trackEvent', 'action', 'copyPaste', `${label}`]);
  } catch {}
}
