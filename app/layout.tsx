import type { Metadata } from "next";
import "./globals.css";
import { getCachedSiteConfig } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

import { Lora, Inter, Roboto, Poppins, Merriweather, Open_Sans, Source_Sans_3 } from "next/font/google";

// Preload a small set of safe web fonts; pick at runtime from site config
const lora = Lora({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

const fontClassMap: Record<string, string> = {
  lora: lora.className,
  inter: inter.className,
  roboto: roboto.className,
  poppins: poppins.className,
  merriweather: merriweather.className,
  "open sans": openSans.className,
  "source sans 3": sourceSans.className,
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedSiteConfig();
  if (!config) {
    return {
      title: "Blog",
      description: "An awesome blog.",
    };
  }
  return {
    title: {
      default: config.siteConfig.seoTitle || "BlazeBlog",
      template: `%s | ${config.siteConfig.seoTitle || "BlazeBlog"}`,
    },
    description: config.siteConfig.homeMetaDescription,
  };
}

const MaintenancePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-4xl font-bold">Down for Maintenance</h1>
    <p className="mt-4 text-lg">We are currently performing maintenance. Please check back later.</p>
  </div>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getCachedSiteConfig();

  if (!siteConfig || siteConfig.featureFlags.maintenanceMode) {
    return (
      <html lang="en" data-theme="light">
        <body className={lora.className}>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  const theme = siteConfig.theme?.colorPalette || "light";
  const configuredFont = siteConfig.theme?.fontFamily || "poppins";
  const key = configuredFont.toLowerCase().replace(/\s+/g, "_");
  const fontClass = fontClassMap[key] || poppins.className;

  console.log("Using font:", theme, "with key:", key, "and class:", fontClass);

  return (
    <html lang="en" data-theme={theme}>
      <body className={fontClass}>
        <NextTopLoader color="#570DF8" crawlSpeed={200} showSpinner={false} height={3} />
        <Header config={siteConfig} />
        <main className="flex-grow">{children}</main>
        <Footer config={siteConfig} />
      </body>
    </html>
  );
}
