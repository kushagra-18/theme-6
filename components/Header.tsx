"use client";

import { useState } from "react";
import { SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";

interface HeaderProps {
  config: SiteConfig;
}

const Header = ({ config }: HeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const allNavLinks = config.headerNavigationLinks || [];
  const { featureFlags } = config;

  const navLinks = allNavLinks.filter(link => {
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
    // Assume other links are always enabled
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Site Wordmark */}
            <div className="text-2xl font-bold">
              <Link href="/">{config.siteConfig.h1 || "BlazeBlog"}</Link>
            </div>

            {/* Center: Nav Items (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.url} href={link.url} className="text-base-content/80 hover:text-base-content">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin" className="text-sm hover:underline">Sign in</Link>
              <button className="btn btn-primary btn-sm rounded-full">Subscribe</button>
            </div>

            {/* Mobile: Hamburger Button */}
            <div className="md:hidden">
              <button onClick={() => setIsDrawerOpen(true)} className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-base-100 md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h2 className="font-bold">{config.siteConfig.h1}</h2>
            <button onClick={() => setIsDrawerOpen(false)} className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="p-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link key={link.url} href={link.url} className="text-lg" onClick={() => setIsDrawerOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 absolute bottom-4 w-full">
            <button className="btn btn-primary w-full">Subscribe</button>
            <div className="text-center mt-4">
              <Link href="/signin" className="text-sm hover:underline" onClick={() => setIsDrawerOpen(false)}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
