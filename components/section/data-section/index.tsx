import { isAPI404 } from "#models/api-not-responding";
import type { IDataFetchingState } from "#models/data-fetching";
import { type ISectionProps, Section } from "..";
import { DataSectionContent, type IDataSectionContentProps } from "./content";

interface IDataSectionProps<T>
  extends ISectionProps,
    IDataSectionContentProps<T> {}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function DataSection<T extends Exclude<unknown, IDataFetchingState>>({
  data,
  notFoundInfo,
  children,
  additionalInfoOnError,
  ...props
}: IDataSectionProps<T>) {
  if (notFoundInfo === null && isAPI404(data)) {
    return null;
  }

  //@ts-expect-error
  const lastModified = props?.lastModified ?? data?.lastModified ?? null;

  return (
    <Section {...props} lastModified={lastModified}>
      <DataSectionContent
        additionalInfoOnError={additionalInfoOnError}
        children={children}
        data={data}
        notFoundInfo={notFoundInfo}
      />
    </Section>
  );
}

export { AsyncDataSectionClient as DataSectionClient } from "./client";
