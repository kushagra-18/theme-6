import { SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";

interface FooterProps {
  config: SiteConfig;
}

const Footer = ({ config }: FooterProps) => {
  const footerLinks = config.footerNavigationLinks || [
    // Mock links if not provided by API
    { label: "Advertise", url: "/advertise" },
    { label: "Sponsor", url: "/sponsor" },
    { label: "Terms & conditions", url: "/terms" },
    { label: "Data & privacy", url: "/privacy" },
  ];
  const siteTitle = config.siteConfig.seoTitle || "BlazeBlog";

  return (
    <footer className="bg-base-200 text-base-content/70 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="border-t border-base-300 pt-6 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Site Title & Utility Links */}
          <div className="flex flex-col md:flex-row items-center text-sm">
            <span className="font-bold mr-4">{siteTitle}</span>
            <nav className="flex flex-wrap justify-center items-center space-x-4 mt-4 md:mt-0">
              {footerLinks.map((link) => (
                <Link key={link.url} href={link.url} className="hover:text-base-content hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Powered By */}
          <div className="text-xs mt-4 md:mt-0">
            <a href="https://blazeblog.co" target="_blank" rel="noopener noreferrer" className="hover:text-base-content">
              Powered by BlazeBlog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
