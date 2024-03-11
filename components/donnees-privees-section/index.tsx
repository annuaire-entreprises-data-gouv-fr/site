import AgentWall from '#components/espace-agent-components/agent-wall';
import constants from '#models/constants';

export const DonneesPriveesSection = () => (
  <AgentWall
    id=""
    title="Données privées"
    sectionIntro={
      <p>
        Les dirigeants de cette entreprise ont demandé à ce que ces informations
        ne soient pas rendues publiques. Seuls les agents publics peuvent
        consulter ces informations.
      </p>
    }
    modalFooter={
      <>
        Si vous souhaitez rendre ces données publiques :{' '}
        <a href={constants.links.parcours.contact}>contactez-nous</a>.
      </>
    }
  />
);
