import { Link } from "#/components/Link";

export const InfoAgentRBE = () => (
  <>
    <p>
      Depuis le 31 juillet 2024, les{" "}
      <Link
        params={{ slug: "registre-des-beneficiaires-effectifs" }}
        to="/faq/$slug"
      >
        bénéficiaires effectifs ne sont plus librement accessibles
      </Link>
      .
    </p>
    <p>
      Les agents publics peuvent y accéder uniquement dans les cas d’usages
      justifiant d’un intérêt légitime. En déclarant le cadre juridique dans
      lequel vous accédez à ces données, vous vous engagez{" "}
      <Link to="/modalites-utilisation">
        à respecter nos modalités d'utilisation
      </Link>
      .
    </p>
    <p>
      Toute demande d’accès aux données est tracée et envoyée à la commission
      européeene.
    </p>
  </>
);
