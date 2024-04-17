import { Tag } from '#components-ui/tag';
import { INPI } from '#components/administrations';

export function PDFNotFound({ downloadLink }: { downloadLink: string }) {
  return (
    <>
      <Tag color="error">introuvable</Tag>
      <p>
        Le document que vous recherchez n’a pas été retrouvé par le téléservice
        de l’
        <INPI />. Si la structure est bien une entreprise,{' '}
        <strong>cela ne devrait pas arriver</strong>. Vous pouvez :
      </p>
      <ol>
        <li>
          Soit essayer de télécharger le document{' '}
          <a target="_blank" rel="noreferrer noopener" href={downloadLink}>
            directement sur le site de l’INPI
          </a>
          .
        </li>
        <li>
          Soit{' '}
          <a href="https://www.inpi.fr/contactez-nous">
            écrire à l’INPI pour leur demander le document.
          </a>
        </li>
        <p>
          L’
          <INPI /> est à la fois l’opérateur du Registre National des
          Entreprises (RNE) et du téléservice qui produit les justificatifs,
          c’est{' '}
          <strong>
            la seule administration en mesure de résoudre le problème
          </strong>
          .
        </p>
      </ol>
    </>
  );
}
