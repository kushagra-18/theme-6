import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { getCachedSiteConfig } from "@/lib/config";
import { notFound } from "next/navigation";
import LatestPostCard from "@/components/LatestPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import JsonLd from "@/components/JsonLd";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export default async function TagPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();

  const [postsResult, config] = await Promise.all([
    client.getPosts({ tags: [params.slug], limit: 12 }),
    getCachedSiteConfig()
  ]);

  const { posts } = postsResult;

  if (!posts || posts.length === 0 || !config) {
    notFound();
  }

  const tag = posts[0].tags.find(t => t.slug === params.slug);
  const tagName = tag?.name || params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      {Array.isArray(postsResult.seo?.jsonLd) && postsResult.seo!.jsonLd.map((node: any, idx: number) => (
        <JsonLd key={idx} data={node} />
      ))}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">{tagName}</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          A collection of posts tagged with "{tagName}". Explore the stories and articles that dive deep into this topic.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <LatestPostCard key={post.id} post={post} config={config} />
        ))}
      </div>

      {config.featureFlags.enableNewsletters && (
        <div className="mt-8">
          <NewsletterSignup compact />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  try {
    const result = await client.getPosts({ tags: [params.slug], limit: 1 });
    if (result?.seo?.meta) {
      return {
        title: result.seo.meta.title,
        description: result.seo.meta.description,
        alternates: { canonical: result.seo.meta.canonicalUrl },
      };
    }
  } catch {}
  const title = `#${params.slug} - Posts`;
  return { title };
}
