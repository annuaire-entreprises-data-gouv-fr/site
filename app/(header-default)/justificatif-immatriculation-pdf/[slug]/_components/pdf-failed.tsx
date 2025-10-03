import { Tag } from "#components-ui/tag";

export function PDFFailed({ downloadLink }: { downloadLink: string }) {
  return (
    <>
      <Tag color="error">échec</Tag>
      <p>
        Le téléchargement direct a échoué et nous avons relancé un
        téléchargement dans un nouvel onglet.
      </p>
      Si besoin,{" "}
      <a
        href={downloadLink}
        id="download-pdf-link"
        onClick={() =>
          window.open(downloadLink, "_blank", "noopener,noreferrer")
        }
        rel="noreferrer noopener"
        target="_blank"
      >
        cliquez ici pour re-lancer un téléchargement dans un nouvel onglet.
      </a>
    </>
  );
}
