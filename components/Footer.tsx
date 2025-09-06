import { SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";

interface FooterProps {
  config: SiteConfig;
}

const Footer = ({ config }: FooterProps) => {
  const allFooterLinks = config.footerNavigationLinks || [];
  const { featureFlags } = config;

  const footerLinks = allFooterLinks.filter(link => {
    const label = link.label.toLowerCase();
    if (label.includes('categories')) {
      return featureFlags.enableCategoriesPage;
    }
    if (label.includes('tags')) {
      return featureFlags.enableTagsPage;
    }
    if (label.includes('authors')) {
      return featureFlags.enableAuthorsPage;
    }
    // Assume other utility links like "Terms" or "Privacy" are always enabled
    return true;
  });

  const siteTitle = config.siteConfig.seoTitle || "BlazeBlog";

  return (
    <footer className="bg-neutral text-neutral-content mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="border-t border-neutral-focus pt-6 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Site Title & Utility Links */}
          <div className="flex flex-col md:flex-row items-center text-sm">
            <span className="font-bold mr-4">{siteTitle}</span>
            <nav className="flex flex-wrap justify-center items-center space-x-4 mt-4 md:mt-0">
              {footerLinks.map((link) => (
                <Link key={link.url} href={link.url} className="hover:opacity-80">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Powered By */}
          <div className="text-xs mt-4 md:mt-0">
            <a href="https://blazeblog.co" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
              Powered by BlazeBlog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
