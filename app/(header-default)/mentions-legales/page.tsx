import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import { NextPageWithLayout } from '../../../pages/_app';

export const metadata: Metadata = {
  title: 'Mentions légales',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/mentions-legales',
  },
};

const Mentions: NextPageWithLayout = () => (
  <TextWrapper>
    <h1>Mentions légales</h1>
    <h2>Éditeur</h2>
    <p>
      Ce site est édité par l’incubateur des services numériques, Direction
      interministérielle du numérique (DINUM), Services du Premier ministre.
    </p>
    <h2>Directrice de la publication</h2>
    <p>
      La directrice de la publication est Stéphanie SCHAER, directrice
      interministérielle du numérique.
    </p>
    <h2>Hébergement de la plateforme</h2>
    <p>Cette plateforme est hébergée par :</p>
    <p>
      OVH
      <br />
      2 rue Kellermann
      <br />
      59100 Roubaix
      <br />
      France
    </p>
    <h2>Conception et gestion du site</h2>
    <p>
      Ce site est développé en mode agile, selon un principe d’amélioration
      continue. De nouvelles fonctionnalités seront ajoutées prochainement.
    </p>
    <h2>Code source du site</h2>
    <p>Le code source du site est disponible sur Github.</p>
  </TextWrapper>
);

export default Mentions;
