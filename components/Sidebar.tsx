import { getSSRBlazeBlogClient, SiteConfig, Tag } from "@/lib/blazeblog";
import Link from "next/link";

async function getTags(): Promise<Tag[]> {
  try {
    const client = await getSSRBlazeBlogClient();
    const { tags } = await client.getTags();
    return tags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

interface SidebarProps {
  config: SiteConfig;
}

const Sidebar = async ({ config }: SidebarProps) => {
  const tags = await getTags();

  return (
    <aside className="hidden md:fixed top-0 left-0 z-40 w-64 h-screen p-8 overflow-y-auto bg-base-200 border-r border-base-300">
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <Link href="/" className="text-3xl font-bold">
            {config.siteConfig.h1 || "BlazeBlog"}
          </Link>
          <p className="mt-4 text-base text-base-content/70">
            {config.siteConfig.homeMetaDescription}
          </p>

          <div className="mt-12">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-base-content/50">Tags</h3>
            <ul className="mt-4 space-y-2">
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link href={`/tag/${tag.slug}`} className="text-base-content/80 hover:text-base-content">
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button className="w-full btn btn-outline">Subscribe</button>
          <div className="mt-6 text-xs text-center text-base-content/50">
            Powered by{" "}
            <a href="https://blazeblog.co" target="_blank" rel="noopener noreferrer" className="underline">
              BlazeBlog
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
