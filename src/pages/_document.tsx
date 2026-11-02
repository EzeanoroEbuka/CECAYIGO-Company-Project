import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // No dark class hardcoded — ThemeContext handles it client-side from
    // localStorage. The design defaults to light mode (Figma is light).
    <Html lang="en">
      <Head>
        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        {/* Favicon */}
        <link rel="icon" type="image/jpeg" href="/image/cec-logo.png" />
        <link rel="icon" type="image/png" href="/image/cec-logo.png" />
        <link rel="apple-touch-icon" href="/image/cec-logo.png" />
        <link rel="shortcut icon" href="/image/cec-logo.png" />

        {/* Theme colour — light mode default */}
        <meta name="theme-color" content="#F8F8F8" />
        <meta name="msapplication-TileColor" content="#1B3A5C" />

        {/* Softgen monitoring */}
        <script
          src="https://cdn.softgen.ai/script.js"
          async
          data-softgen-monitoring="true"
        />
      </Head>
      {/* No background forced on body — bg-background in Layout handles it */}
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
