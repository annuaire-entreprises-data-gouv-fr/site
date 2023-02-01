export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
      <link
        rel="shortcut icon"
        href="/favicons/favicon.ico"
        type="image/x-icon"
      />
      <link
        rel="manifest"
        href="/favicons/manifest.webmanifest"
        cross-origin="use-credentials"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="http://localhost:3001/frontend/style/dsfr.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="http://localhost:3001/frontend/style/globals.css"
      />
      <script
        defer
        type="module"
        src="http://localhost:3001/@vite/client"
      ></script>
      <script
        defer
        type="module"
        src="http://localhost:3001/frontend/src/index.js"
      ></script>

      <body>{children}</body>
    </html>
  );
}
