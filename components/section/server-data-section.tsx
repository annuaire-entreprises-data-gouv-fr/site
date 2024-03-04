import React from 'react';
import AdministrationNotRespondingMessage from '#components/administration-not-responding/message';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { ISectionProps, Section } from '.';

interface IServerDataSectionProps<T> extends ISectionProps {
  data: IAPINotRespondingError | T;
  notFoundInfo?: React.ReactNode;
  additionalInfoOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function ServerDataSection<T extends Exclude<unknown, IAPILoading>>({
  data,
  notFoundInfo,
  additionalInfoOnError,
  ...props
}: IServerDataSectionProps<T>) {
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  if (isAPINotResponding(data)) {
    if (data.errorType === 404 && notFoundInfo === null) {
      return null;
    }

    if (data.errorType === 404 && notFoundInfo) {
      return (
        <Section {...props} lastModified={lastModified}>
          {notFoundInfo}
        </Section>
      );
    }

    const administrationMetaData =
      administrationsMetaData[data.administration] || {};
    return (
      <Section {...props} lastModified={lastModified}>
        <AdministrationNotRespondingMessage
          administrationMetaData={administrationMetaData}
        />
        {additionalInfoOnError ?? null}
      </Section>
    );
  }

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Section {...props} lastModified={lastModified}>
      {props.children(data)}
    </Section>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}
