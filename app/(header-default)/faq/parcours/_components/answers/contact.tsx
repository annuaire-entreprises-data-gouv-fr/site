import { Link } from "#components/Link";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { ParcoursAnswer } from ".";

type IProps = {
  userType: string;
  session: ISession | null;
};

export const ContactAnswer: React.FC<IProps> = ({ session, userType }) => (
  <ParcoursAnswer>
    {userType === "independant" && (
      <p>
        Si vous possédez une <strong>entreprise individuelle</strong> dont vous
        souhaitez <strong>cacher ou afficher</strong> les informations
        personnelles,{" "}
        <Link href="/faq/rendre-mon-entreprise-non-diffusible">
          consultez notre fiche
        </Link>
        .
      </p>
    )}
    <p>
      Si vous avez une question{" "}
      <strong>à propos des informations affichées sur le site</strong>, ou un
      problème lié au <strong>fonctionnement du site</strong>, vous pouvez nous
      contacter via le formulaire ci-dessous :
    </p>
    <div className="layout-center">
      {/*
            Custom JS and CSS has been added to this Crisp form.
            It can be found at this address :
            https://app.crisp.chat/website/064fca1b-bdd6-4a81-af56-9f38e40953ad/plugins/settings/b68ffdd2-ba6e-46a6-94bb-d0a9872ce09a/
            */}
      <iframe
        frameBorder="0"
        height="660px"
        referrerPolicy="origin"
        sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
        src={`https://plugins.crisp.chat/urn:crisp.im:contact-form:0/contact/064fca1b-bdd6-4a81-af56-9f38e40953ad?type=${userType}${
          session?.user?.email ? `&email=${session?.user?.email}` : ""
        }${session?.user?.fullName ? `&name=${session?.user?.fullName}` : ""}`}
        title="Contact Form"
        width="100%"
      />
    </div>
    <p>
      <strong>NB :</strong> si votre question concerne une structure en
      particulier, pensez à mentionner le <strong>siren ou le siret</strong>{" "}
      dans votre message.
    </p>
    {hasRights(session, ApplicationRights.isAgent) && (
      <p>
        Rejoignez notre salon{" "}
        <a
          href="https://tchap.gouv.fr/#/room/#annuaire-entreprises:agent.dinum.tchap.gouv.fr"
          rel="noopener noreferrer"
          target="_blank"
        >
          Tchap
        </a>{" "}
        pour nous contacter ou être tenu au courant de nos nouveautés.
      </p>
    )}
  </ParcoursAnswer>
);
