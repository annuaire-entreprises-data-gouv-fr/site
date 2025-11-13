"use client";

import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import type { IQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { formatDate, formatDateLong } from "#utils/helpers";

type QualifelecContentProps = {
  data: IQualifelec;
};

export function QualifelecContent({
  data: qualifelec,
}: QualifelecContentProps) {
  return (
    <>
      <p>
        Cette entreprise possède un ou plusieurs{" "}
        <a
          aria-label="En savoir plus sur les certificats Qualifelec, nouvelle fenêtre"
          href="https://www.qualifelec.fr/pourquoi-choisir-une-entreprise-qualifelec/le-certificat-qualifelec-la-meilleure-des-recommandations/"
          rel="noreferrer"
          target="_blank"
        >
          certificats Qualifelec
        </a>{" "}
        valides.
      </p>
      <FullTable
        body={qualifelec.map((c) => [
          c.numero,
          c.qualification.label,
          `Du ${formatDate(c.dateDebut)} au ${formatDate(c.dateFin)}`,
          <ul>
            <li>
              Assurance civile : {c.assuranceCivile.nom} (du{" "}
              {formatDateLong(c.assuranceCivile.dateDebut)} au{" "}
              {formatDateLong(c.assuranceCivile.dateFin)})
            </li>
            <li>
              Assurance décennale : {c.assuranceDecennale.nom} (du{" "}
              {formatDateLong(c.assuranceDecennale.dateDebut)} au{" "}
              {formatDateLong(c.assuranceDecennale.dateFin)})
            </li>
          </ul>,

          <ButtonLink
            alt
            ariaLabel="Télécharger le certificat Qualifelec, nouvelle fenêtre"
            small
            target="_blank"
            to={c.documentUrl}
          >
            Télécharger
          </ButtonLink>,
        ])}
        head={["N°", "Qualification", "Validité", "Assurances", "Certificat"]}
        verticalAlign="top"
      />
    </>
  );
}
