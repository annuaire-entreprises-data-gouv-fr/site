"use client";

import routes from "#clients/routes";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import type { IDocumentsRNE } from "#models/rne/types";
import { formatDateLong, pluralize } from "#utils/helpers";
import { getFiscalYear } from "#utils/helpers/formatting/format-fiscal-year";
import { BilanTypeTag } from "../bilan-tag";

type IBilansDocumentsSocieteContentProps = {
  data: IDocumentsRNE;
};

export const NoBilans = () => (
  <>Aucun compte n’a été déposé au RNE pour cette entreprise.</>
);

const BilansTable = ({ bilans }: { bilans: IDocumentsRNE["bilans"] }) => (
  <FullTable
    body={bilans.map((a) => [
      formatDateLong(a.dateDepot),
      getFiscalYear(a.dateCloture),
      <BilanTypeTag type={a.typeBilan} />,
      <ButtonLink
        alt
        small
        target="_blank"
        to={`${routes.espaceAgent.documents.download}${a.id}?type=bilan`}
      >
        Télécharger
      </ButtonLink>,
    ])}
    head={["Date de dépôt", "Année fiscale", "Type de bilan", "Lien"]}
  />
);

export default function BilansDocumentsSocieteContent({
  data: documents,
}: IBilansDocumentsSocieteContentProps) {
  return documents.bilans?.length === 0 ? (
    <NoBilans />
  ) : (
    <>
      <p>
        Cette entreprise possède {documents.bilans.length} bilan
        {pluralize(documents.bilans)} déposé{pluralize(documents.bilans)} au RNE
        :
      </p>
      {documents.hasBilanConsolide && (
        <>
          <h3>
            Bilans{" "}
            <FAQLink tooltipLabel="Consolidés">
              Une entreprise peut déposer différents types de bilans :
              <ul>
                <li>simplifié : un bilan allégé</li>
                <li>complet : le bilan classique</li>
                <li>
                  consolidé : un bilan qui intègre les données des filiales d’un
                  groupe
                </li>
              </ul>
            </FAQLink>
          </h3>
          <div>
            Cette entreprise a notamment déclaré des{" "}
            <FAQLink
              to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
              tooltipLabel="bilans consolidés"
            >
              Qu’est-ce qu’un bilan consolidé ?
            </FAQLink>
          </div>
          <br />
          <BilansTable
            bilans={documents.bilans.filter((b) => b.typeBilan === "K")}
          />
          <br />
        </>
      )}
      <h3>
        Bilans{" "}
        <FAQLink tooltipLabel="Complets ou Simplifiés">
          Une entreprise peut déposer différents types de bilans :
          <ul>
            <li>simplifié : un bilan allégé</li>
            <li>complet : le bilan classique</li>
            <li>
              consolidé : un bilan qui intègre les données des filiales d’un
              groupe
            </li>
          </ul>
        </FAQLink>
      </h3>
      <BilansTable
        bilans={documents.bilans.filter((b) => b.typeBilan !== "K")}
      />
    </>
  );
}
