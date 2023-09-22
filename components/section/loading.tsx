import { Loader } from '#components-ui/loader';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export interface IProps {
  title: string;
  sources?: EAdministration[];
  id?: string;
}

export const LoadingSection: React.FC<IProps> = ({
  id,
  title,
  sources = [],
}) => (
  <Section id={id} title={title} sources={sources}>
    <div className="layout-center">
      <span>
        Nous récupérons les annonces de cette structure <Loader />
      </span>
    </div>
  </Section>
);
