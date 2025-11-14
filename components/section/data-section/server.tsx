import { Suspense } from "react";
import { FadeIn } from "#components-ui/animation/fade-in";
import { HeightTransition } from "#components-ui/animation/height-transition";
import { Section } from "..";
import { DataSectionLoader } from "./loader";
import {
  AsyncDataSectionServerContent,
  type IDataSectionServerContentProps,
} from "./server-content";

interface IDataSectionServerProps<T, ContentComponentProps extends { data: T }>
  extends IDataSectionServerContentProps<T, ContentComponentProps> {}

export function AsyncDataSectionServer<
  T,
  ContentComponentProps extends { data: T },
>({ data, ...props }: IDataSectionServerProps<T, ContentComponentProps>) {
  return (
    <Suspense
      fallback={
        <Section {...props}>
          <HeightTransition>
            <FadeIn>
              <DataSectionLoader sources={props.sources} />
            </FadeIn>
          </HeightTransition>
        </Section>
      }
    >
      <AsyncDataSectionServerContent data={data} {...props} />
    </Suspense>
  );
}
