import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import AdministrationNotRespondingMessage from '#components/administration-not-responding/message';
import { administrationsMetaData } from '#models/administrations';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { ISectionProps, Section } from '.';
import DataSectionLoader from './data-section-loader';

interface IDataSectionProps<T> extends ISectionProps {
  data: IAPINotRespondingError | IAPILoading | T;
  hideIf404?: boolean;
  additionalInformationOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

export function SectionStateMachine<T extends {}>({
  data,
  hideIf404 = false,
  additionalInformationOnError,
  ...props
}: IDataSectionProps<T>) {
  if (isAPILoading(data)) {
    const dataSources = Array.from(new Set(props.sources || [])).map(
      (key) => administrationsMetaData[key]
    );
    return <DataSectionLoader dataSources={dataSources} />;
  } else {
    if (isAPINotResponding(data)) {
      const administrationMetaData =
        administrationsMetaData[data.administration] || {};

      return (
        <>
          <AdministrationNotRespondingMessage
            administrationMetaData={administrationMetaData}
          />
          {additionalInformationOnError ?? null}
        </>
      );
    } else {
      return props.children(data);
    }
  }
}

/**
 * Uses data's type to handle transitions, display loader, error or formatted data
 * @param param0
 * @returns
 */
export function DataSection<T extends {}>({ ...props }: IDataSectionProps<T>) {
  const { data } = props;
  //@ts-ignore
  const lastModified = data?.lastModified || null;

  if (isAPINotResponding(data) && data.errorType === 404 && props.hideIf404) {
    return null;
  }

  return (
    <Section {...props}>
      <HeightTransition>
        <FadeIn>
          <SectionStateMachine {...props} lastModified={lastModified} />
        </FadeIn>
      </HeightTransition>
    </Section>
  );
}
