import { getSSRBlazeBlogClient, SiteConfig } from "@/lib/blazeblog";
import LeadCard from "@/components/LeadCard";
import SecondaryCard from "@/components/SecondaryCard";
import FeaturedCard from "@/components/FeaturedCard";
import LatestPostCard from "@/components/LatestPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import JsonLd from "@/components/JsonLd";
import TagCloud from "@/components/TagCloud";
import { Metadata } from "next";

import { getCachedSiteConfig } from "@/lib/config";

export default async function HomePage() {
  const client = await getSSRBlazeBlogClient();

  const [postsResult, config] = await Promise.all([
    client.getPosts({ limit: 15 }),
    getCachedSiteConfig()
  ]);

  const { posts } = postsResult;

  if (!config) {
    return <p className="text-center text-error">Could not load site configuration.</p>;
  }
  if (posts.length === 0) {
    return <p className="text-center">No posts found.</p>;
  }

  const leadPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const featuredPosts = posts.slice(3, 9);
  const homeTags = (postsResult as any).tags || [];
  const latestPosts = posts.slice(9);

  return (
    <div className="container mx-auto px-4 py-8">
      {Array.isArray(postsResult.seo?.jsonLd) && postsResult.seo!.jsonLd.map((node: any, idx: number) => (
        <JsonLd key={idx} data={node} />
      ))}
      {/* Hero Section */}
      <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px] mb-16">
        {leadPost && <LeadCard post={leadPost} config={config} />}
        {secondaryPosts.map((post) => (
          <SecondaryCard key={post.id} post={post} config={config} />
        ))}
      </div>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured</h2>
          {config.featureFlags.enableTagsPage && homeTags.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 4).map((post) => (
                  <FeaturedCard key={post.id} post={post} config={config} />
                ))}
              </div>
              <div className="lg:col-span-1">
                <TagCloud tags={homeTags} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.id} post={post} config={config} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Newsletter (if enabled) */}
      {config.featureFlags.enableNewsletters && <NewsletterSignup />}

      {/* Latest Section */}
      {latestPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Latest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {latestPosts.map((post) => (
              <LatestPostCard key={post.id} post={post} config={config} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  try {
    const result = await client.getPosts({ limit: 1 });
    if (result?.seo?.meta) {
      return {
        title: result.seo.meta.title,
        description: result.seo.meta.description,
        alternates: { canonical: result.seo.meta.canonicalUrl },
      };
    }
  } catch {}
  return {};
}
