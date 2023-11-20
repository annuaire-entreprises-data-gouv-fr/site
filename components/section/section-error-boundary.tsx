import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';
import Warning from '#components-ui/alerts/warning';
import constants from '#models/constants';

export default function SectionErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SentryErrorBoundary
      fallback={(error) => (
        <div>
          {error instanceof SyntaxError && window.IS_OUTDATED_BROWSER ? (
            <>
              <Warning>
                Votre navigateur est trop vieux pour afficher cette section.
              </Warning>
              <p>
                Avoir un navigateur à jour est{' '}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://www.ssi.gouv.fr/entreprise/precautions-elementaires/bonnes-pratiques-de-navigation-sur-linternet/"
                >
                  fortement recommandé par l’ANSSI
                </a>{' '}
                pour naviguer sur internet en sécurité.
              </p>
            </>
          ) : (
            <>
              <Warning>
                Une erreur innatendue est survenue lors de l’affichage de cette
                section
              </Warning>
              <p>
                L’équipe technique a été notifiée. Si le problème persiste, vous
                pouvez{' '}
                <a href={constants.links.parcours.contact}>nous contacter</a>{' '}
                pour que nous puissions trouver la panne 🕵️‍♀️.
              </p>
            </>
          )}
        </div>
      )}
    >
      {children}
    </SentryErrorBoundary>
  );
}
