"use client";

import { TwoColumnTable } from "#components/table/simple";
import FAQLink from "#components-ui/faq-link";
import type { IOpqibi } from "#models/espace-agent/certificats/opqibi";
import { formatDateLong } from "#utils/helpers";

type OpqibiContentProps = {
  data: IOpqibi;
};

export function OpqibiContent({ data: opqibi }: OpqibiContentProps) {
  return (
    <>
      <p>
        Cette entreprise possède un{" "}
        <a
          aria-label="En savoir plus sur les certificats Opqibi, nouvelle fenêtre"
          href="https://www.opqibi.com/page/la-qualification-opqibi"
          rel="noreferrer"
          target="_blank"
        >
          certificat Opqibi
        </a>{" "}
        valide.
      </p>
      <TwoColumnTable
        body={[
          [
            "Date de délivrance",
            formatDateLong(opqibi.dateDelivranceCertificat),
          ],
          ["Durée de validité", opqibi.dureeValiditeCertificat],
          ["Assurances", opqibi.assurances],
          [
            "Certificat",
            <a
              aria-label="Voir au certificat sur le site OPQIBI, nouvelle fenêtre"
              href={opqibi.url}
              target="_blank"
            >
              Voir le certificat
            </a>,
          ],
        ]}
      />
      {opqibi.qualifications.length && opqibi.qualifications.length > 0 ? (
        <>
          <h4>Qualifications</h4>
          <TwoColumnTable
            body={[
              [
                "Labels",
                <Qualification qualifications={opqibi.qualifications} />,
              ],
              [
                "Date de validité",
                formatDateLong(opqibi.dateValiditeQualifications),
              ],
            ]}
          />
        </>
      ) : null}
      {opqibi.qualificationsProbatoires.length &&
      opqibi.qualificationsProbatoires.length > 0 ? (
        <>
          <h4>
            <FAQLink tooltipLabel="Qualifications probatoires">
              Un certificat de qualification probatoire atteste qu’une structure
              possède l’aptitude à réaliser les prestations pour lesquelles elle
              est qualifiée, mais qu’elle ne les a pas encore ou pas
              suffisamment réalisées
            </FAQLink>
          </h4>
          <p />
          <TwoColumnTable
            body={[
              [
                "Labels",
                <Qualification
                  qualifications={opqibi.qualificationsProbatoires}
                />,
              ],
              [
                "Date de validité",
                formatDateLong(opqibi.dateValiditeQualificationsProbatoires),
              ],
            ]}
          />
        </>
      ) : null}
    </>
  );
}

function Qualification({
  qualifications,
}: {
  qualifications: IOpqibi["qualifications"];
}) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {qualifications.map((qualification) => (
        <li key={qualification.codeQualification}>
          <FAQLink
            tooltipLabel={`${qualification.codeQualification} : ${
              qualification.nom
            }${qualification.rge ? " - RGE" : ""}`}
          >
            {qualification.definition}
          </FAQLink>
        </li>
      ))}
    </ul>
  );
}
