import { Loader } from '#components-ui/loader';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export interface IProps {
  title: string;
  sources?: EAdministration[];
  description: string;
  id?: string;
}

export const LoadingSection: React.FC<IProps> = ({
  id,
  title,
  description,
  sources = [],
}) => (
  <Section id={id} title={title} sources={sources}>
    <div className="layout-center">
      <span>
        {description} <Loader />
      </span>
    </div>
  </Section>
);
