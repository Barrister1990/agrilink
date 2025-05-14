import AgriLinkIntro from "@/components/AgriLinkIntro";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import SponsoredProducts from "@/components/SponsoredProducts";
import SupermarketProducts from "@/components/SupermarketProducts";
import TopSellingItems from "@/components/TopSellingItems";
import WholePrices from "@/components/WholePrices";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Agri Link – Empowering Local Farmers Through eCommerce</title>
        <meta
          name="description"
          content="Agri Link is an eCommerce platform dedicated to empowering local farmers by providing better market access, reducing post-harvest losses, and enabling more harvest through efficient distribution."
        />
        <meta name="keywords" content="Agri Link, agriculture, ecommerce, farmers market, post-harvest, local produce, wholesale, farm-to-table" />
        <meta name="author" content="Agri Link" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Agri Link – Empowering Local Farmers Through eCommerce" />
        <meta
          property="og:description"
          content="Discover how Agri Link connects local farmers to buyers, improves sales, and reduces post-harvest losses through innovative eCommerce solutions."
        />
        <meta property="og:url" content="https://agrilink-taupe.vercel.app/" />
        <meta property="og:image" content="https://agrilink-taupe.vercel.app/logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agri Link – Empowering Local Farmers Through eCommerce" />
        <meta
          name="twitter:description"
          content="Agri Link gives local farmers better market access, reduced losses, and more revenue through modern eCommerce tools."
        />
        <meta name="twitter:image" content="https://agrilink-taupe.vercel.app/logo.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Hero />
        <FlashSale saleEndTime="2025-12-16T23:59:59" />
        <SponsoredProducts />
        <WholePrices />
        <SupermarketProducts />
        <TopSellingItems />
        <AgriLinkIntro />
      </div>
    </>
  );
}
