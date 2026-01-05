import { INPI } from "#components/administrations";
import { DataInpiLinkWithExplanations } from "#components/justificatifs/data-inpi-link";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import FAQLink from "#components-ui/faq-link";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatDate } from "#utils/helpers";

const formatDateCloture = (DDMM: string) => {
  if (DDMM && DDMM.length === 4) {
    return `${DDMM.slice(0, 2)}/${DDMM.slice(2)}`;
  }
  return DDMM;
};

export const UniteLegaleImmatriculationSection = ({
  uniteLegale,
  rneLastModified,
  session,
}: {
  uniteLegale: IUniteLegale;
  rneLastModified: string | null;
  session: ISession | null;
}) => {
  const immatriculation = uniteLegale.immatriculation;

  if (!immatriculation) {
    return null;
  }

  return (
    <Section
      id="immatriculation-rne"
      lastModified={rneLastModified}
      sources={[EAdministration.INPI]}
      title="Immatriculation au RNE"
    >
      <p>
        Cette structure est une entreprise immatriculée au{" "}
        <strong>Registre National des Entreprises (RNE)</strong>. Ce registre
        liste les entreprises de France. Il est tenu par l’
        <INPI />.
      </p>
      <TwoColumnTable
        body={[
          ...(immatriculation
            ? [
                [
                  "Date d’immatriculation",
                  formatDate(immatriculation?.dateImmatriculation),
                ],
                [
                  "Date de début d’activité",
                  formatDate(immatriculation?.dateDebutActivite),
                ],
                [
                  "Nature de l’entreprise",
                  (immatriculation?.natureEntreprise || []).join(", "),
                ],
                ...(immatriculation?.isPersonneMorale
                  ? [
                      [
                        <FAQLink tooltipLabel="Capital social">
                          Le capital social d’une société est constitué des
                          apports (en argent ou en nature) de ses actionnaires.
                          <br />
                          Il peut être fixe ou variable. La modification d’un
                          capital fixe nécessite une modification des statuts
                          tandis que le capital variable peut varier dans
                          certaines limites sans modification des statuts.
                        </FAQLink>,
                        immatriculation?.capital,
                      ],
                      [
                        "Clôture de l’exercice comptable",
                        formatDateCloture(immatriculation?.dateCloture),
                      ],
                    ]
                  : []),
                ...(immatriculation?.dateFin
                  ? [
                      [
                        "Date de fin de la personne morale",
                        formatDate(immatriculation.dateFin),
                      ],
                    ]
                  : []),
                ...(immatriculation?.dateRadiation
                  ? [
                      [
                        "Date de radiation",
                        formatDate(immatriculation?.dateRadiation),
                      ],
                    ]
                  : []),
                [
                  "Dirigeants",
                  <a href={`/dirigeants/${uniteLegale.siren}`}>
                    → Consulter la liste des dirigeants
                  </a>,
                ],
                [
                  <FAQLink tooltipLabel="Annonces et observations">
                    Les annonces BODACC et les observations au RNE assurent la
                    publicité des actes enregistrés pour une entreprise
                    (procédures collectives, ventes, créations, modification,
                    radiation et dépôt des comptes)
                  </FAQLink>,
                  <a href={`/annonces/${uniteLegale.siren}`}>
                    → Consulter les annonces
                  </a>,
                ],
              ]
            : []),
        ]}
      />
      <DataInpiLinkWithExplanations
        session={session}
        uniteLegale={uniteLegale}
      />
    </Section>
  );
};
