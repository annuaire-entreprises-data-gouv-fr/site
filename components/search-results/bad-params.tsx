import constants from '#models/constants';

export const BadParams = () => (
  <div>
    <br />
    <div>
      <h3>
        🤯 Nous rencontrons un problème avec un ou plusieurs des filtres que
        vous avez sélectionné.
      </h3>
      <p>
        Vous pouvez essayez d’identifier le filtre qui pose problème. Si vous
        n’y parvenez pas,{' '}
        <a href={constants.links.parcours.contact}>
          vous pouvez nous contacter.
        </a>
      </p>
    </div>
    <br />
  </div>
);
