import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';
import { Warning } from '#components-ui/alerts';
import constants from '#models/constants';
import { Section } from '.';

export default function SectionErrorBoundary({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <SentryErrorBoundary
      fallback={
        <Section title={title}>
          <Warning>
            Une erreur est survenue lors de l’affichage de cette section.
          </Warning>
          {typeof window !== 'undefined' && !window.IS_OUTDATED_BROWSER && (
            <p>
              L’équipe technique a été notifiée. Si le problème persiste, vous
              pouvez{' '}
              <a href={constants.links.parcours.contact}>nous contacter</a> pour
              que nous puissions trouver la panne 🕵️‍♀️.
            </p>
          )}
        </Section>
      }
    >
      {children}
    </SentryErrorBoundary>
  );
}
