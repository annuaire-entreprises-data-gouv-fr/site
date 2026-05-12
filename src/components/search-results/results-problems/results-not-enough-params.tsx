import { Link } from "#/components/Link";
import { getFaqArticlesByTag } from "#/models/article/faq";

export const NotEnoughParams = () => {
  const articles = getFaqArticlesByTag(["search"]);
  return (
    <div>
      <br />
      <div>
        <h3>
          🔍 Votre requête ne contient pas assez de paramètres de recherche pour
          nous permettre de vous proposer un résultat.
        </h3>
        Vous pouvez, au choix :
        <ul>
          <li>Utiliser un terme de recherche plus long (au moins 3 lettres)</li>
          <li>
            Utiliser des critères de recherche géographiques ou administratifs
          </li>
          <li>
            Rechercher toutes les structures liées à une personne (dirigeant(e),
            ou élu(e))
          </li>
        </ul>
        <br />
        <strong>
          Vous avez une question concernant le fonctionnement du moteur de
          recherche ?
        </strong>
        <ul>
          {articles.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/faq/${slug}`}>{title}</Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/faq">→ Voir toutes les questions fréquentes</Link>
        </p>
      </div>
      <br />
    </div>
  );
};
