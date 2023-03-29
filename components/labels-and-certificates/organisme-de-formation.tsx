import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export const OrganismeDeFormation = () => (
  <Section
    title="Organisme de formation"
    sources={[EAdministration.DINUM, EAdministration.METI]}
  >
    {/* TEST SHOULD UPDATE ORDING */}
    Cette structure est un organisme de formation
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet possimus,
      earum obcaecati explicabo maxime nemo minus expedita, commodi eaque sint
      nostrum doloribus corrupti soluta ad esse recusandae id. Eveniet, fuga?
    </div>
  </Section>
);
