/* eslint-disable react/jsx-props-no-spreading */

import AdministrationNotRespondingMessage from '#components/administration-not-responding/message';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';

export type IDataSectionContentProps<T> = {
  data: IAPINotRespondingError | T;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
};

export function DataSectionContent<T extends Exclude<unknown, IAPILoading>>({
  data,
  notFoundInfo,
  children,
  additionalInfoOnError,
}: IDataSectionContentProps<T>) {
  if (isAPINotResponding(data)) {
    if (data.errorType === 404 && notFoundInfo === null) {
      return null;
    }

    if (data.errorType === 404 && notFoundInfo) {
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
