import { getSSRBlazeBlogClient, SiteConfig } from "@/lib/blazeblog";
import LeadCard from "@/components/LeadCard";
import SecondaryCard from "@/components/SecondaryCard";
import FeaturedCard from "@/components/FeaturedCard";
import LatestPostCard from "@/components/LatestPostCard";
import TaglineBlock from "@/components/TaglineBlock";

export default async function HomePage() {
  const client = await getSSRBlazeBlogClient();

  const [postsResult, config] = await Promise.all([
    client.getPosts({ limit: 15 }),
    client.getSiteConfig()
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
  const latestPosts = posts.slice(9);

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} config={config} />
            ))}
          </div>
        </section>
      )}

      {/* Tagline Block */}
      <TaglineBlock />

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
