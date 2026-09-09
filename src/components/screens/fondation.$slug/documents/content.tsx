import NonRenseigne from "#/components/non-renseigne";
import { FullTable } from "#/components/table/full";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";
import { formatDateLong } from "#/utils/helpers";

const documentFormats: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
};

export const NoDocumentsFondation = () => (
  <p>Aucun document n’a été retrouvé pour cette fondation dans le RNF.</p>
);

export function DocumentsFondationContent({
  documents,
}: Pick<IFondationsRestreintes, "documents">) {
  if (documents.length === 0) {
    return <NoDocumentsFondation />;
  }

  const sortedDocuments = [...documents].sort((a, b) =>
    (b.dateDepot || "").localeCompare(a.dateDepot || "")
  );

  return (
    <>
      <p>
        {documents.length} document{documents.length > 1 ? "s" : ""} enregistré
        {documents.length > 1 ? "s" : ""} au Répertoire national des fondations
        (RNF).
      </p>
      <FullTable
        body={sortedDocuments.map((document) => [
          document.nomOriginal || document.id || <NonRenseigne />,
          document.type || <NonRenseigne />,
          document.dateDepot ? (
            formatDateLong(document.dateDepot)
          ) : (
            <NonRenseigne />
          ),
          document.typeMime ? (
            documentFormats[document.typeMime] || document.typeMime
          ) : (
            <NonRenseigne />
          ),
        ])}
        head={["Document", "Type de document", "Date de dépôt", "Format"]}
        verticalAlign="top"
      />
    </>
  );
}
