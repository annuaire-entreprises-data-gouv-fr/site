import Info from './info';

const NonDiffusibleAlert = () => (
  <Info full>
    Cette structure est non-diffusible. Cela signifie que certaines informations
    ne sont pas publiquement accessibles.
    <br />
    Si c’est votre entreprise et que vous souhaitez vous la rendre diffusible,{' '}
    <a href="https://statut-diffusion-sirene.insee.fr/">
      vous pouvez en faire la demande sur le site de l’Insee.
    </a>
  </Info>
);
export default NonDiffusibleAlert;
