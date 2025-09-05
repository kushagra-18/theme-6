import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { notFound } from "next/navigation";
import LatestPostCard from "@/components/LatestPostCard";

type Props = {
  params: { slug: string };
};

export default async function TagPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  // The API doesn't return tag-specific metadata, so we improvise.
  const { posts } = await client.getPosts({ tags: [params.slug], limit: 12 });

  if (!posts || posts.length === 0) {
    notFound();
  }

  // Find the tag name from the first post, assuming it's consistent.
  const tag = posts[0].tags.find(t => t.slug === params.slug);
  const tagName = tag?.name || params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Optional Banner Placeholder */}
      {/* <div className="h-48 bg-base-200 rounded-lg mb-8"></div> */}

      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">{tagName}</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          A collection of posts tagged with "{tagName}". Explore the stories and articles that dive deep into this topic.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <LatestPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
