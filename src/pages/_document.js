import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Paystack Payment Script */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />

        {/* Basic SEO Meta Tags */}
        <meta name="description" content="AgrigriLink is an agriculture-focused eCommerce platform founded by Charles Awuku, empowering farmers in Ghana through technology." />
        <meta name="keywords" content="AgrigriLink, agriculture, ecommerce, Ghana, farm produce, Charles Awuku, agritech, farm marketplace, farmers" />
        <meta name="author" content="Charles Awuku" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agrilink-taupe.vercel.app/" />
        <meta property="og:title" content="AgrigriLink - Empowering Farmers in Ghana" />
        <meta property="og:description" content="An agric eCommerce platform connecting Ghanaian farmers to buyers. Founded by Charles Awuku." />
        <meta property="og:image" content="https://agrilink-taupe.vercel.app/logo.png" />

        {/* Twitter Meta Tags */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://agrilink-taupe.vercel.app/" />
        <meta property="twitter:title" content="AgrigriLink - Empowering Farmers in Ghana" />
        <meta property="twitter:description" content="An agric eCommerce platform connecting Ghanaian farmers to buyers. Founded by Charles Awuku." />
        <meta property="twitter:image" content="https://agrilink-taupe.vercel.app/logo.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
