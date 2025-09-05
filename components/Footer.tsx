import { SiteConfig } from "@/lib/blazeblog";

interface FooterProps {
  config: SiteConfig;
}

const Footer = ({ config }: FooterProps) => {
  // The "Source" theme has its footer content integrated into the sidebar.
  // This component will be kept minimal and we will build the main footer
  // in the Sidebar component.
  return null;
};

export default Footer;
