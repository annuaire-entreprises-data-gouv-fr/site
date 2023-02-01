export default function Head() {
  const manifest = (
    process.env.NODE_ENV === 'production'
      ? require('../public/manifest.json')
      : {}
  ) as { [key: string]: any };

  return (
    <>
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
      {process.env.NODE_ENV !== 'production' ? (
        <>
          <link
            href="http://localhost:3001/frontend/style/dsfr.min.css"
            precedence="default"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="stylesheet"
            precedence="default"
            type="text/css"
            href="http://localhost:3001/frontend/style/globals.css"
          />
          <script
            defer
            async
            type="module"
            src="http://localhost:3001/@vite/client"
          ></script>
          <script
            defer
            async
            type="module"
            src="http://localhost:3001/frontend/src/index.js"
          ></script>
        </>
      ) : (
        <>
          <link
            rel="stylesheet"
            precedence="default"
            type="text/css"
            href={`/${manifest['style/dsfr.min.css'].file}`}
          />
          <link
            rel="stylesheet"
            precedence="default"
            type="text/css"
            href={`/${manifest['style/globals.css'].file}`}
          />
          <script
            defer
            async
            type="module"
            src={`/${manifest['src/index.js'].file}`}
          ></script>
        </>
      )}
    </>
  );
}
