import { FadeIn } from '#components-ui/animation/fade-in';
import { HeightTransition } from '#components-ui/animation/height-transition';
import { Loader } from '#components-ui/loader';
import AdministrationNotResponding from '#components/administration-not-responding';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationMetaData } from '#models/administrations/types';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { ISectionProps, Section } from '.';

interface IAPISectionProps<T> extends Omit<ISectionProps, 'lastModified'> {
  APIRequest: IAPINotRespondingError | IAPILoading | T;
  hideIf404?: boolean;
  isTitlePlural?: (data: T) => boolean;
  pluralTitle?: string;
  additionalInformationOnError?: React.ReactNode;
  children: (data: T) => JSX.Element;
}

export function APISection<T extends {}>({
  APIRequest,
  hideIf404 = false,
  additionalInformationOnError,
  isTitlePlural,
  ...props
}: IAPISectionProps<T>) {
  const APILoading = isAPILoading(APIRequest);
  const APINotResponding =
    !isAPILoading(APIRequest) && isAPINotResponding(APIRequest);

  const APIRequestData = !APILoading && !APINotResponding && (APIRequest as T);

  const dataSources = Array.from(new Set(props.sources)).map(
    (key) => administrationsMetaData[key]
  );

  if (
    hideIf404 &&
    !APILoading &&
    APINotResponding &&
    APIRequest.errorType === 404
  ) {
    return null;
  }

  const title =
    !isTitlePlural || (APIRequestData && !isTitlePlural(APIRequestData))
      ? props.title
      : props.pluralTitle ?? props.title + 's';

  const lastModified =
    (APIRequestData &&
      'lastModified' in APIRequestData &&
      typeof APIRequestData.lastModified === 'string' &&
      APIRequestData.lastModified) ||
    null;

  return APINotResponding ? (
    <AdministrationNotResponding
      administration={APIRequest.administration}
      errorType={APIRequest.errorType}
      title={title}
      additionalInformation={additionalInformationOnError}
    />
  ) : (
    <Section lastModified={lastModified} {...props} title={title}>
      <HeightTransition>
        {APILoading ? (
          <LoaderContent dataSources={dataSources} />
        ) : (
          <FadeIn>{props.children(APIRequest)}</FadeIn>
        )}
      </HeightTransition>
    </Section>
  );
}

function LoaderContent({
  dataSources,
}: {
  dataSources: IAdministrationMetaData[];
}) {
  return (
    <div className="layout-center">
      {!dataSources ? (
        <span>
          Nous récupérons les informations <Loader />
        </span>
      ) : dataSources.length === 1 ? (
        <span>
          Nous récupérons les informations dans la base de données «{' '}
          {dataSources[0].long} » <Loader />
        </span>
      ) : (
        <>
          <Loader /> Nous récupérons les informations dans les bases de données
          :
          <ul>
            {dataSources.map((d) => (
              <li key={d.slug}>{d.long}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
