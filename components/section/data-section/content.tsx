/* eslint-disable react/jsx-props-no-spreading */

import AdministrationNotRespondingMessage from "#components/administration-not-responding/message";
import { administrationsMetaData } from "#models/administrations";
import {
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IDataFetchingState } from "#models/data-fetching";

export type IDataSectionContentProps<T> = {
  data: IAPINotRespondingError | T;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => React.JSX.Element;
};

export function DataSectionContent<
  T extends Exclude<unknown, IDataFetchingState.LOADING>,
>({
  data,
  notFoundInfo,
  children,
  additionalInfoOnError,
}: IDataSectionContentProps<T>) {
  if (isAPINotResponding(data)) {
    if (isAPI404(data) && notFoundInfo === null) {
      return null;
    }

    if (isAPI404(data) && notFoundInfo) {
      return notFoundInfo;
    }

    const administrationMetaData =
      administrationsMetaData[data.administration] || {};

    return (
      <>
        <AdministrationNotRespondingMessage
          administrationMetaData={administrationMetaData}
        />
        {additionalInfoOnError ?? null}
      </>
    );
  }

  return children(data);
}
