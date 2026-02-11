import { clientAPIProxy } from "#clients/api-proxy/client";
import routes from "#clients/routes";
import constants from "#models/constants";
import { DataStore } from "#utils/data-store";

const FEATURE_FLAGS = [
  "incident_banner_displayed",
  "proconnect_incident_banner_displayed",
  "partners_data_incident_banner_displayed",
] as const;
export type FeatureFlag = (typeof FEATURE_FLAGS)[number];
type FeatureFlagValue = boolean | string;

/**
 * List of feature flags
 */
class FeatureFlagsList {
  public _list: DataStore<FeatureFlagValue>;
  // time before feature flags list update
  private TTL = 2 * 60 * 1000; // 2 minutes

  constructor() {
    this._list = new DataStore<FeatureFlagValue>(
      () =>
        clientAPIProxy<{ [key in FeatureFlag]: FeatureFlagValue }>(
          routes.proxy.featureFlags,
          {
            timeout: constants.timeout.M,
          }
        ).catch(() => ({})),
      "feature-flags",
      this.mapResponseToFeatureFlagsList,
      this.TTL
    );
  }

  mapResponseToFeatureFlagsList = (
    response: {
      [key in FeatureFlag]: FeatureFlagValue;
    }
  ) =>
    FEATURE_FLAGS.reduce(
      (acc, flag) => {
        acc[flag] = response[flag];
        return acc;
      },
      {} as { [key in FeatureFlag]: FeatureFlagValue }
    );
}

const featureFlags = new FeatureFlagsList();

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) => {
  const value = await featureFlags._list.get(featureFlag);
  return value === true || value === "true";
};

export const getFeatureFlagsList = async () => {
  const keys = (await featureFlags._list.getKeys()) as FeatureFlag[];
  const result = await Promise.allSettled(
    keys.map(async (key) => isFeatureFlagEnabled(key))
  );

  return result.reduce(
    (acc: { [key in FeatureFlag]: boolean }, result, index) => {
      acc[keys[index]] = result.status === "fulfilled" ? result.value : false;
      return acc;
    },
    {} as { [key in FeatureFlag]: boolean }
  );
};
