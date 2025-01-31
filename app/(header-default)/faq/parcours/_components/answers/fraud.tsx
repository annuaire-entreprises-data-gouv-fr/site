import ButtonLink from '#components-ui/button';
import { ParcoursAnswer } from '.';

export const FraudAnswer: React.FC<{}> = ({}) => (
  <ParcoursAnswer>
    <strong>Attention à la fraude :</strong> l’Annuaire des Entreprise est un
    service public <strong>gratuit</strong> et ne vous demandera{' '}
    <strong>jamais</strong> d’argent. Pour en savoir plus, consultez{' '}
    <a href="/faq/fraudes-ecroqueries-annuaire-des-entreprises">
      notre fiche explicative
    </a>
    .
    <p>
      Si vous désirez signaler une entreprise frauduleuse, rendez-vous sur{' '}
      <a href="https://signal.conso.gouv.fr/fr">SignalConso</a>.
    </p>
    <div className="layout-center">
      <ButtonLink to="https://signal.conso.gouv.fr/fr">SignalConso</ButtonLink>
    </div>
  </ParcoursAnswer>
);
