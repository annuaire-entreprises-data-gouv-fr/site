import { useEffect } from "react";

/**
 * Log an event in matomo but rendered from server side
 * @param param0
 * @returns
 */
const MatomoEvent = ({
  category,
  action,
  name,
}: {
  category: string;
  action: string;
  name: string;
}) => {
  useEffect(() => {
    window._paq ??= [];

    window._paq.push(["trackEvent", category, action, name]);
  }, [category, action, name]);

  return null;
};
export default MatomoEvent;
