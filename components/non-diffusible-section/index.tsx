import ButtonLink from '#components-ui/button';
import { INSEE } from '#components/administrations';
import { Section } from '#components/section';

export const NonDiffusibleSection = () => (
  <Section title="Qu’est ce qu’une entreprise non-diffusible ?">
    <p>
      Certaines entreprises demandent à ne pas figurer sur les listes de
      diffusion publique en vertu de{' '}
      <a href="https://www.legifrance.gouv.fr/affichCodeArticle.do;jsessionid=C505A51DBC1A4EB1FFF3764C69ACDB1C.tpdjo11v_1?idArticle=LEGIARTI000020165030&cidTexte=LEGITEXT000005634379&dateTexte=20100702">
        l’article A123-96 du code du commerce
      </a>
      . On parle d’entreprise <strong>non-diffusible</strong>. Dans ce cas nous{' '}
      <strong>ne diffusons pas les informations</strong> de cette entreprise sur
      l’Annuaire des Entreprises.
    </p>
    <p>
      Pour des raisons de sécurité, certaines associations et les organismes
      relevant du Ministère de la Défense ne sont pas diffusibles non plus.
    </p>
    <p>
      Si cette entreprise est la vôtre et que vous souhaitez vous la rendre de
      nouveau diffusible, la démarche est à effectuer auprès de l’
      <INSEE />
      &nbsp;:
    </p>
    <div className="layout-center">
      <ButtonLink to="https://statut-diffusion-sirene.insee.fr/" alt>
        ⇢ Rendre mon entreprise diffusible
      </ButtonLink>
    </div>{' '}
  </Section>
);
