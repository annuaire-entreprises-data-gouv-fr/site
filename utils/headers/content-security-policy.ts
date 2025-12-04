const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://stats.data.gouv.fr/",
  ],
  "worker-src": ["'self'", "blob:"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "frame-src": [
    "'self'",
    "https://stats.data.gouv.fr/",
    "https://plugins.crisp.chat/",
  ],
  "connect-src": [
    "'self'",
    "https://stats.data.gouv.fr/",
    "https://errors.data.gouv.fr/",
    "https://bodacc-datadila.opendatasoft.com/",
    "https://data.economie.gouv.fr/",
    "https://journal-officiel-datadila.opendatasoft.com/",
    "https://api-lannuaire.service-public.gouv.fr/",
    "https://data.culture.gouv.fr/",
    "https://data.inpi.fr/",
    "https://openmaptiles.geo.data.gouv.fr/",
    "https://openmaptiles.data.gouv.fr/",
    "https://geo.api.gouv.fr",
    "https://api-adresse.data.gouv.fr",
    "https://tabular-api.data.gouv.fr",
    "https://koumoul.com",
  ],
};

export default function getContentSecurityPolicy() {
  return Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}
