import AgentNavigation from '#components/espace-agent-components/agent-navigation';

export default function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgentNavigation />
      {children}
    </>
  );
}
