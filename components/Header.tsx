import { SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

const Header = ({ config }: { config: SiteConfig }) => {
  const { siteConfig, headerNavigationLinks } = config;

  return (
    <header className="bg-neutral text-neutral-content">
      <div className="container mx-auto navbar bg-neutral text-neutral-content px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-neutral text-neutral-content rounded-box w-64">
              {headerNavigationLinks?.map((link) => (
                <li key={link.url}>
                  {link.children && link.children.length > 0 ? (
                    <details>
                      <summary className="cursor-pointer">{link.label}</summary>
                      <ul className="p-2">
                        {link.children.map((child) => (
                          <li key={child.url}>
                            <Link href={child.url} className="hover:opacity-80">{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={link.url}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            {siteConfig.logoPath ? (
              <Image src={siteConfig.logoPath} alt={siteConfig.seoTitle} width={120} height={32} className="h-8 w-auto" />
            ) : (
              siteConfig.seoTitle
            )}
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {headerNavigationLinks?.map((link) => (
              <li key={link.url}>
                {link.children && link.children.length > 0 ? (
                  <details>
                    <summary className="cursor-pointer hover:opacity-80">{link.label}</summary>
                    <ul className="p-2 bg-neutral text-neutral-content rounded-box">
                      {link.children.map((child) => (
                        <li key={child.url}>
                          <Link href={child.url} className="hover:opacity-80">{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={link.url}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
