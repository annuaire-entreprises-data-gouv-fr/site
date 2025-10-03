"use client";
import { type ChangeEvent, useState } from "react";
import type { IMatomoStats } from "#clients/matomo";
import { StackedBarChart } from "#components/chart/stack-bar";
import { Select } from "#components-ui/select";
import constants from "#models/constants";

type IStatType = "agents" | "users" | "api";

export const TraficStats: React.FC<Partial<IMatomoStats>> = ({
  visits = [],
}) => {
  const [statsType, setStatsType] = useState<IStatType>("users");

  const data = {
    datasets:
      statsType === "api"
        ? [
            {
              label: "Nombre d’appels reçus par l’API Recherche d’Entreprises",
              data: visits.map(({ label, apiRequests }) => ({
                y: apiRequests,
                x: label,
              })),
              backgroundColor: constants.chartColors[1],
            },
          ]
        : [
            {
              label:
                statsType === "agents"
                  ? "Agents récurrents"
                  : "Utilisateurs récurrents",
              data: visits.map(
                ({ label, visitorReturning, agentReturning }) => ({
                  y: statsType === "agents" ? agentReturning : visitorReturning,
                  x: label,
                })
              ),
              backgroundColor: constants.chartColors[0],
            },
            {
              label:
                statsType === "agents"
                  ? "Agents occasionnels"
                  : "Utilisateurs occasionnels",
              data: visits.map(({ label, visitorUnknown, agentUnknown }) => ({
                y: statsType === "agents" ? agentUnknown : visitorUnknown,
                x: label,
              })),
              backgroundColor: constants.chartColors[1],
            },
          ],
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatsType(e.target.value as IStatType);
  };

  return (
    <>
      <p>
        Nous suivons le nombre d’<strong>utilisateurs</strong> et le nombre d’
        <strong>agents connectés</strong>.
      </p>
      <ul>
        <li>
          Un <strong>utilisateur</strong> est un individu qui visite l’Annuaire
          des Entreprises au moins une fois dans le mois.
        </li>
        <li>
          Un <strong>agent connecté</strong> est un agent public qui s’est
          identifié avec{" "}
          <a
            href="https://www.proconnect.gouv.fr/"
            rel="noopener noreferrer"
            target="_blank"
            title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
          >
            ProConnect
          </a>{" "}
          pour{" "}
          <a href="https://annuaire-entreprises.data.gouv.fr/lp/agent-public">
            avoir accès à des informations additionnelles (actes, statuts, etc.)
          </a>
          .
        </li>
      </ul>
      <p>
        Un utilisateur ou un agent connecté qui visite le site une fois dans le
        mois a un usage <strong>occasionnel</strong>. À l’inverse, s’il visite
        le site plusieurs fois dans le mois, il a un usage{" "}
        <strong>récurrent</strong>.
      </p>
      <div className="layout-right">
        <div>Afficher les données par&nbsp;</div>
        <Select
          defaultValue={"users"}
          onChange={onOptionChange}
          options={[
            { value: "users", label: "utilisateurs" },
            { value: "agents", label: "agents" },
            { value: "api", label: "appels API" },
          ]}
        />
      </div>
      <StackedBarChart data={data} />
      <p>
        Le suivi des évolutions des visites et du nombre d’utilisateurs nous
        informe sur les tendances globales de l’utilisation du service :
      </p>
      <ul>
        <li>
          L’augmentation des <strong>utilisateurs occasionnels</strong> est un
          marqueur de la notoriété du service
        </li>
        <li>
          L’augmentation des <strong>utilisateurs récurrents</strong> (au moins
          2 visites dans le mois) est un marqueur de l’efficacité du service
        </li>
      </ul>
      <p>
        Nous suivons également le nombre d’appels reçus par{" "}
        <a href="/donnees/api-entreprises">
          notre API de Recherche d’entreprises
        </a>
        . Ce chiffre inclut les appels provenant du site{" "}
        <strong>Annuaire des Entreprises</strong> et les appels externes,
        provenant d’acteurs privés ou publics.
      </p>
    </>
  );
};
