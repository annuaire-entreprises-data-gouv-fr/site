import { Link } from "#/components/link";
import Logo from "#/components-ui/logo";
import { administrationsMetaData } from "#/models/administrations";
import styles from "./style.module.css";

const AdministrationDescription: React.FC<{
  slug: string; // EAdministration
  titleLevel?: "h2" | "h3";
}> = ({ slug, titleLevel = "h2" }) => {
  if (!administrationsMetaData[slug]) {
    throw new Error(`Administration ${slug} does not exist`);
  }

  const {
    description,
    contact,
    long,
    dataSources,
    logoType,
    estServicePublic,
  } = administrationsMetaData[slug];

  return (
    <div className={styles["administration-wrapper"]} id={`${slug}-section`}>
      <div>
        <Logo
          alt=""
          height={80}
          slug={logoType ? slug : "rf"}
          title=""
          width={80}
        />
      </div>
      <div>
        {titleLevel === "h2" ? <h2>{long}</h2> : <h3>{long}</h3>}
        <section>
          <p>{description}</p>
          {dataSources.length > 0 && (
            <div>
              <strong>Données transmises :</strong>
              <ul>
                {dataSources.map(({ data = [] }) =>
                  data.map(({ label }) => (
                    <li key={label}>
                      <Link
                        aria-label={`${label} — données transmises par ${long}`}
                        hash={`${slug}-section`}
                        to="/donnees/sources"
                      >
                        {label}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          <p>
            <Link
              aria-label={`Télécharger ou réutiliser ces données — ${long}`}
              hash={`${slug}-section`}
              to="/donnees/sources"
            >
              → Télécharger ou réutiliser ces données
            </Link>
            <br />
            {contact && (
              <a
                aria-label={`Contacter cette ${estServicePublic ? "administration" : "organisation"} — ${long}${contact.includes("@") ? " par courriel" : " — nouvelle fenêtre"}`}
                href={
                  (contact || "").indexOf("@") > -1
                    ? `mailto:${contact}`
                    : contact
                }
                rel="noreferrer noopener"
                target="_blank"
              >
                → Contacter cette{" "}
                {estServicePublic ? "administration" : "organisation"}
              </a>
            )}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AdministrationDescription;
