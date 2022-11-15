import { NotEnoughParamsIllustration } from '../../components-ui/illustration';
import { getFaqArticlesByTag } from '../../models/faq';

export const NotEnoughParams = () => {
  const articles = getFaqArticlesByTag(['search']);
  return (
    <div>
      <br />
      <NotEnoughParamsIllustration />
      <div>
        <p>
          <b>
            Votre requête ne contient pas assez de paramètres de recherche pour
            nous permettre de vous proposer un résultat.
          </b>
        </p>
        Vous pouvez, au choix :
        <ul>
          <li>Utiliser un terme de recherche plus long (au moins 3 lettres)</li>
          <li>
            Utiliser des critères de recherche géographiques ou administratifs
          </li>
          <li>Rechercher toutes les entreprises associées a une personne</li>
        </ul>
        <br />
        <b>
          Vous avez une question concernant le fonctionnement du moteur de
          recherche ?
        </b>
        <ul>
          {articles.map(({ slug, title }) => (
            <li>
              <a href={`/faq/${slug}`}>{title}</a>
            </li>
          ))}
        </ul>
        <p>
          <a href="/faq">→ Voir toutes les questions fréquentes</a>
        </p>
      </div>
    </div>
  );
};
