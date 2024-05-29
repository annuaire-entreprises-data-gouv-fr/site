import { Section } from '#components/section';
import { DataSectionLoader } from '#components/section/data-section/loader';
import { sectionInfo } from './common';

export default function Loader() {
  return (
    <Section {...sectionInfo}>
      <DataSectionLoader sources={sectionInfo.sources} />
    </Section>
  );
}
