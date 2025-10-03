"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { InternalError } from "#models/exceptions";
import style from "./copy-paste.module.css";

type ICopyPasteProps = {
  disableCopyIcon?: boolean;
  shouldRemoveSpace?: boolean;
  id?: string;
  children: string;
  label: string;
};

function copyFallback(value: string) {
  const el = document.createElement("textarea");
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
export function CopyPaste({
  children,
  shouldRemoveSpace = false,
  disableCopyIcon = false,
  id,
  label,
}: ICopyPasteProps) {
  if (typeof children !== "string") {
    throw new InternalError({
      message: `CopyPaste component can only be used with string children, got ${typeof children}`,
    });
  }

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const element = useRef<HTMLButtonElement>(null);

  const copyToClipboard = (e: any) => {
    const valueToCopy = shouldRemoveSpace
      ? children.replace(/\s/g, "")
      : children;

    try {
      if (!document.hasFocus()) {
        throw new Error("document is not focused");
      }
      navigator.clipboard.writeText(valueToCopy);
    } catch {
      copyFallback(valueToCopy);
    }

    const isKeyboardNavigation = e.detail === 0;
    if (isKeyboardNavigation) {
      element.current?.focus();
    } else {
      setFocused(false);
    }
    setCopied(true);
    logCopyPaste(label);
    timeoutId.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleBlur = () => {
    setFocused(false);
    setCopied(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);

  const copyIconRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (copyIconRef.current && copyIconRef.current.offsetTop > 0) {
      copyIconRef.current.classList.add(style.copyTooltipAbsolute);
    }
  });

  return (
    <button
      aria-label={`${children}, copier dans le presse-papier`}
      className={`${style.copyButton} ${
        disableCopyIcon ? style.copyIconDisabled : ""
      }`}
      onBlur={handleBlur}
      onClick={copyToClipboard}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={element}
      title="Cliquez pour copier dans le presse-papier"
    >
      <span id={id}>{children} </span>
      {(hovered || copied || focused) && !disableCopyIcon && (
        <span
          aria-hidden
          className={style.copyIcon}
          ref={copyIconRef}
          style={{ color: copied ? "green" : "" }}
        >
          {copied ? (
            <>
              <CheckMarkSVG />
              <span> copié</span>
            </>
          ) : (
            <>
              <CopySVG />
              <span> copier</span>
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
      fill="none"
      height="15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
    </svg>
  );
}

function CheckMarkSVG() {
  return (
    <svg
      fill="none"
      height="15px"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="2"
      viewBox="0 0 30 30"
      width="15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 16L11 23 27 7" />
    </svg>
  );
}

function logCopyPaste(label: string) {
  try {
    var _paq = window._paq || [];
    _paq.push(["trackEvent", "action", "copyPaste", `${label}`]);
  } catch {}
}
