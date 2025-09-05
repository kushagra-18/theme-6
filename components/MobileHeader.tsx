"use client";

import { SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";

interface MobileHeaderProps {
  config: SiteConfig;
}

const MobileHeader = ({ config }: MobileHeaderProps) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-base-300 bg-base-100">
      <Link href="/" className="text-xl font-bold">
        {config.siteConfig.h1 || "BlazeBlog"}
      </Link>
      {/* A button to toggle a mobile menu could be added here */}
      <button className="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </header>
  );
};

export default MobileHeader;
