import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // `dark` class is set here so it is present on SSR HTML — ThemeContext
    // then reconciles it client-side from localStorage / system preference.
    <Html lang="en" className="dark">
      <Head>
        {/* ── Viewport — MUST live here, not in _app.tsx, to apply on every page ── */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        {/* ── Favicon — CeC Ayigo company logo ── */}
        <link rel="icon" type="image/jpeg" href="/image/cec-logo.png" />
        <link rel="icon" type="image/png" href="/image/cec-logo.png" />
        <link rel="apple-touch-icon" href="/image/cec-logo.png" />
        <link rel="shortcut icon" href="/image/cec-logo.png" />

        {/* Theme colour */}
        <meta name="theme-color" content="#0B0F1A" />
        <meta name="msapplication-TileColor" content="#E51E25" />

        {/* Softgen monitoring */}
        <script
          src="https://cdn.softgen.ai/script.js"
          async
          data-softgen-monitoring="true"
        />
      </Head>
      <body className="antialiased bg-[#0B0F1A]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
