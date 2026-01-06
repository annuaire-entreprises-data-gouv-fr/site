import { clientAPIProxy } from "#clients/api-proxy/client";
import routes from "#clients/routes";
import constants from "#models/constants";
import { DataStore } from "#utils/data-store";

type FeatureFlag =
  | "new_agent_onboarding"
  | "other_new_feature"
  | "an_off_feature";
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
        ),
      "feature-flags",
      this.mapResponseToFeatureFlagsList,
      this.TTL
    );
  }

  mapResponseToFeatureFlagsList = (
    response: {
      [key in FeatureFlag]: FeatureFlagValue;
    }
  ) => response;
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
