import Head from "next/head";
import { HeroSection } from "@/components/home/HeroSection";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { PopularProducts } from "@/components/home/PopularProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          CEC Lighting — Solar &amp; Electrical Distributor, Lagos Nigeria
        </title>
        <meta
          name="description"
          content="CEC Ayigo and Sons Lightings — CAC-registered distributor of solar systems, LED street lights, floodlights, inverters and batteries. Nationwide delivery from Alaba International Market, Lagos."
        />
        <meta
          name="keywords"
          content="solar Nigeria, LED lighting Lagos, solar inverter, solar street light, solar floodlight, Alaba market, CEC Lighting"
        />
        <link rel="icon" href="/image/cec-logo.png" />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="preconnect"
          href="https://firebasestorage.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="dns-prefetch"
          href="https://firebasestorage.googleapis.com"
        />
      </Head>

      <main>
        <HeroSection />
        <ShopByCategory />
        <PopularProducts />
        <WhyChooseUs />
      </main>
    </>
  );
}
