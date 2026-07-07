import { Section } from "#/components/section";
import { FullTable } from "#/components/table/full";
import { useAgentWallAbTest } from "#/hooks/use-ab-test";
import type { EAdministration } from "#/models/administrations/e-administration";
import { AgentWallOriginal } from "./agent-wall-original";
import { AgentWallVariationA } from "./agent-wall-variation-a";
import { AgentWallVariationB } from "./agent-wall-variation-b";
import style from "./style.module.css";

const AgentWall: React.FC<{
  title: string;
  id?: string;
  sectionIntro?: React.JSX.Element;
  modalFooter?: React.JSX.Element;
  sources?: EAdministration[];
}> = ({ id, title, sectionIntro = null, modalFooter = null, sources = [] }) => {
  const variation = useAgentWallAbTest();

  return (
    <Section id={id} isProtected sources={sources} title={title}>
      {sectionIntro}
      <div className={style["cta-wrapper"]}>
        {variation === "original" && (
          <AgentWallOriginal modalFooter={modalFooter} sectionId={id} />
        )}
        {variation === "VariationA" && <AgentWallVariationA sectionId={id} />}
        {variation === "VariationB" && <AgentWallVariationB sectionId={id} />}
        <div aria-hidden className={style.blur} tab-index="-1">
          <p>
            Nous recrutons ! Consultez notre{" "}
            <a href="https://www.numerique.gouv.fr/rejoignez-nous/">
              page carrière
            </a>{" "}
            ou{" "}
            <a href="https://beta.gouv.fr/recrutement/">celle de beta.gouv</a>.
          </p>
          <FullTable
            body={[
              ["Intrapreneurs", "Le/la responsable du service numérique"],
              ["Développeur frontend", "React, Vue, Rails etc."],
              ["Développeur backend", "Typescript, Rails, Python etc."],
              ["Data Engineer", "Airflow, Python"],
              ["Devops", "Ansible, Scalingo, OVH"],
              ["Chargé de déploiement", "Relations avec les administrations"],
              ["Chargé de marketing", "SEO, communication"],
              ["Product Manager", "Gestion du produit"],
              ["Designer", "UX, UI, Product designer"],
              ["Chargé des relations usagers", "Outils de support"],
            ].map(([a, b]) => [a, b])}
            head={["Métier", "Description"]}
          />
        </div>
      </div>
    </Section>
  );
};

export default AgentWall;
