import { Tag } from '#components-ui/tag';

export function PDFFailed({ downloadLink }: { downloadLink: string }) {
  return (
    <>
      <Tag color="error">échec</Tag>
      <p>
        Le téléchargement direct a échoué et nous avons relancé un
        téléchargement dans un nouvel onglet.
      </p>
      Si besoin,{' '}
      <a
        id="download-pdf-link"
        target="_blank"
        rel="noreferrer noopener"
        href={downloadLink}
        //@ts-ignore
        onClick={window.open(downloadLink, '_blank', 'noopener,noreferrer')}
      >
        cliquez ici pour re-lancer un téléchargement dans un nouvel onglet.
      </a>
    </>
  );
}
