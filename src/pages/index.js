import AgriLinkIntro from "@/components/AgriLinkIntro";
import FlashSale from "@/components/FlashSale";
import Hero from "@/components/Hero";
import SponsoredProducts from "@/components/SponsoredProducts";
import SupermarketProducts from "@/components/SupermarketProducts";
import TopSellingItems from "@/components/TopSellingItems";
import WholePrices from "@/components/WholePrices";

export default function Home() {
  return (
    <div>
    <Hero />
    <FlashSale saleEndTime="2025-12-16T23:59:59" />
    <SponsoredProducts />
    <WholePrices />
    <SupermarketProducts />
    <TopSellingItems />
    <AgriLinkIntro />
    </div>
  );
}
