import { readFromGrist } from "#clients/external-tooling/grist";
import { DataStore } from "#utils/data-store";

type FeatureFlagValue = boolean | string;

/**
 * List of feature flags
 */
class FeatureFlagsList {
  public _list: DataStore<FeatureFlagValue>;
  // time before protected siren list update
  private TTL = 3_600_000; // 1h

  constructor() {
    this._list = new DataStore<FeatureFlagValue>(
      () => readFromGrist("feature-flags"),
      "feature-flags",
      this.mapResponseToFeatureFlagsList,
      this.TTL
    );
  }

  mapResponseToFeatureFlagsList = (
    response: { feature_name: string; value: FeatureFlagValue }[]
  ) => {
    console.log("==== response ==== ", response);
    const featureFlagsList = response
      .filter((row) => !!row.feature_name)
      .reduce(
        (acc: { [key: string]: FeatureFlagValue }, row) => {
          acc[row.feature_name] = row.value;
          return acc;
        },
        {} as { [key: string]: FeatureFlagValue }
      );

    return featureFlagsList;
  };
}

const featureFlags = new FeatureFlagsList();

export const isFeatureFlagEnabled = async (featureFlag: string) => {
  const value = await featureFlags._list.get(featureFlag);
  return value === true || value === "true";
};

export const getFeatureFlagsList = async () => {
  const keys = await featureFlags._list.getKeys();
  const result = await Promise.allSettled(
    keys.map(async (key) => isFeatureFlagEnabled(key))
  );

  return result.reduce(
    (acc: { [key: string]: boolean }, result, index) => {
      acc[keys[index]] = result.status === "fulfilled" ? result.value : false;
      return acc;
    },
    {} as { [key: string]: boolean }
  );
};
