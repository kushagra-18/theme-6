import type { Metadata } from "next";
import "./globals.css";
import { getSSRBlazeBlogClient, SiteConfig } from "@/lib/blazeblog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// This is a temporary minimal layout to allow for component implementation.
// It will be fleshed out later.

export const metadata: Metadata = {
  title: "BlazeBlog",
  description: "A blog powered by BlazeBlog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Mocking siteConfig for now as we are focusing on component implementation
  const mockSiteConfig: SiteConfig = {
    featureFlags: {
      enableTagsPage: true,
      maintenanceMode: false,
      enableAuthorsPage: true,
      autoApproveComments: true,
      enableCommentsReply: true,
      enableCategoriesPage: true,
      enableComments: true,
      enableNewsletters: true,
    },
    siteConfig: {
      h1: "News Wave",
      logoPath: "",
      seoTitle: "News Wave",
      aboutUsContent: "",
      homeMetaDescription: "A modern blog.",
    },
    analytics: {} as any,
    analyticsScripts: { scripts: [] },
    headerNavigationLinks: [
      { label: "Environment", url: "/tag/environment" },
      { label: "Economy", url: "/tag/economy" },
      { label: "Health", url: "/tag/health" },
      { label: "Culture", url: "/tag/culture" },
      { label: "About", url: "/about" },
    ],
  };

  return (
    <html lang="en" data-theme="light">
      <body>
        <Header config={mockSiteConfig} />
        <main className="flex-grow">{children}</main>
        <Footer config={mockSiteConfig} />
      </body>
    </html>
  );
}
