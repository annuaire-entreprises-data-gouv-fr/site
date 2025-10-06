import AgentWall from "#components/espace-agent-components/agent-wall";

export const DonneesPriveesSection = ({ title }: { title?: string }) => (
  <AgentWall
    id=""
    sectionIntro={
      <p>
        Les dirigeants de cette entreprise ont demandé à ce que ces informations
        ne soient pas rendues publiques. Seuls les agents publics peuvent
        consulter ces informations.
      </p>
    }
    title={title ? `${title} (données privées)` : "Données privées"}
  />
);
