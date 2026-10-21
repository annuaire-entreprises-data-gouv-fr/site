import { useRouter } from "@tanstack/react-router";
import { type FormEvent, type MouseEvent, useCallback } from "react";

/**
 * Search pages that display a skeleton while the search is running
 */
const SEARCH_PATHS_WITH_SKELETON = ["/rechercher", "/rechercher/fondations"];

const getSearchHref = (url: URL) =>
  url.origin === window.location.origin &&
  SEARCH_PATHS_WITH_SKELETON.includes(url.pathname.replace(/\/$/, ""))
    ? url.pathname + url.search + url.hash
    : null;

/**
 * Search forms and links (pagination, filters) are plain HTML so that they
 * work without JS. Once hydrated, navigate client-side instead so that the
 * search page skeleton is displayed rather than waiting for a full page load.
 */
export function useClientSideSearchNavigation() {
  const router = useRouter();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      if (form.method.toLowerCase() !== "get") {
        return;
      }

      const { submitter } = e.nativeEvent as SubmitEvent;
      const formData = new FormData(form, submitter);
      const url = new URL(form.action, window.location.href);
      url.search = new URLSearchParams(
        [...formData.entries()].map(([key, value]) => [key, String(value)])
      ).toString();

      const href = getSearchHref(url);
      if (!href) {
        return;
      }
      e.preventDefault();
      router.navigate({ href });
    },
    [router]
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (
        !anchor?.href ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const href = getSearchHref(new URL(anchor.href));
      if (!href) {
        return;
      }
      e.preventDefault();
      router.navigate({ href });
    },
    [router]
  );

  return { onSubmit, onClick };
}
