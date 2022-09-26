const head = `
<head>
  <title>L’Annuaire des Entreprises</title>
  <meta char-set="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="robots" content="index,nofollow">
  <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">
  <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicons/favicon.ico" type="image/x-icon">
  <link rel="manifest" href="/favicons/manifest.webmanifest" cross-origin="use-credentials">
  
</head>
`;

renderPage = (body) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${head}
    <body>
      <div class="fr-container>
        ${body}
      </div>
    </body>
  </html>`;
};

module.exports = { renderPage };
