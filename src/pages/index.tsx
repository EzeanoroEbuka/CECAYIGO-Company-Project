import Head from "next/head";
import {
  HeroSection,
  AboutSection,
  GrowthSection,
  StatsSection,
  PresenceSection,
  CtaSection,
} from "@/components/home/LandingPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          CEC Ayigo and Sons Lightings — Solar & Electrical Distributor, Lagos
        </title>
        <meta
          name="description"
          content="Official platform of CEC Ayigo and Sons Lightings. CAC-registered distributor of solar systems, LED lighting, and electrical accessories across Nigeria."
        />
        <meta
          name="keywords"
          content="solar Nigeria, LED lighting Lagos, solar inverter, solar street light, solar floodlight, Alaba market"
        />
        <link rel="icon" href="/image/cec-logo.png" />
      </Head>

      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <GrowthSection />
        <PresenceSection />
        <CtaSection />
      </main>
    </>
  );
}
