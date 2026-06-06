if (!document.currentScript) {
  document.currentScript = (() => {
    const scripts = document.getElementsByTagName("script");
    return scripts.at(-1);
  })();
}

const userType = document.currentScript.getAttribute("data-user-type");
const siteId = document.currentScript.getAttribute("data-site-id");

window._paq = window._paq || [];
if (userType) {
  window._paq.push(["setCustomDimension", "1", userType]);
}
window._paq.push(["setTrackerUrl", "https://stats.data.gouv.fr/piwik.php"]);
window._paq.push(["setSiteId", siteId]);

const matomoAbTestingListeners = new Set();

window.matomoAbTesting = {
  variations: {
    AdvancedSearchFilters: "original",
  },
  getVariation(name) {
    return this.variations[name] ?? "original";
  },
  setVariation(name, variation) {
    if (this.variations[name] === variation) {
      return;
    }

    this.variations[name] = variation;
    for (const listener of matomoAbTestingListeners) {
      listener();
    }
  },
  subscribe(listener) {
    matomoAbTestingListeners.add(listener);
    return () => matomoAbTestingListeners.delete(listener);
  },
};

window._paq.push([
  "AbTesting::create",
  {
    name: "AdvancedSearchFilters",
    percentage: 100,
    includedTargets: [
      {
        attribute: "url",
        inverted: "0",
        type: "regexp",
        value: "^(.*)/rechercher$",
      },
    ],
    excludedTargets: [],
    variations: [
      {
        name: "original",
        activate() {
          window.matomoAbTesting.setVariation(
            "AdvancedSearchFilters",
            "original"
          );
        },
      },
      {
        name: "Variation1",
        activate() {
          window.matomoAbTesting.setVariation(
            "AdvancedSearchFilters",
            "Variation1"
          );
        },
      },
    ],
    trigger() {
      return true;
    },
  },
]);

window._paq.push(["trackPageView"]);
window._paq.push(["enableLinkTracking"]);
