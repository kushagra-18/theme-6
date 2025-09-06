import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { getCachedSiteConfig } from "@/lib/config";
import { notFound } from "next/navigation";
import LatestPostCard from "@/components/LatestPostCard";

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();

  const [postsResult, config] = await Promise.all([
    client.getPosts({ category: params.slug, limit: 12 }),
    getCachedSiteConfig()
  ]);

  const { posts, category } = postsResult;

  if (!posts || posts.length === 0 || !config) {
    notFound();
  }

  const categoryName = category?.name || params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">{categoryName}</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          A collection of posts in the "{categoryName}" category. Explore the stories and articles that dive deep into this topic.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <LatestPostCard key={post.id} post={post} config={config} />
        ))}
      </div>
    </div>
  );
}
