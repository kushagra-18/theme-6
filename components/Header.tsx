import { SiteConfig } from "@/lib/blazeblog";

interface HeaderProps {
  config: SiteConfig;
}

const Header = ({ config }: HeaderProps) => {
  // The "Source" theme has its header content integrated into the sidebar.
  // This component will be kept minimal and we will build the main navigation
  // in the Sidebar component.
  return null;
};

export default Header;
