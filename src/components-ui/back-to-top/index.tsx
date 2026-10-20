import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon } from "#/components-ui/icon/wrapper";
import { PrintNever } from "#/components-ui/print-visibility";
import styles from "./style.module.css";

const VISIBILITY_SCROLL_OFFSET = 160;

export function BackToTop() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const shouldDisplay = window.scrollY > VISIBILITY_SCROLL_OFFSET;
      setIsVisible((currentValue) =>
        currentValue === shouldDisplay ? currentValue : shouldDisplay
      );
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  useEffect(() => {
    setIsVisible(window.scrollY > VISIBILITY_SCROLL_OFFSET);
  }, [location.pathname]);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <PrintNever>
      <div
        className={isVisible ? styles.visible : styles.hidden}
        data-back-to-top
      >
        <button
          aria-label="Retour en haut de la page"
          className={styles.button}
          onClick={handleClick}
          type="button"
        >
          <Icon size={20} slug="chevronUp" />
        </button>
      </div>
    </PrintNever>
  );
}
