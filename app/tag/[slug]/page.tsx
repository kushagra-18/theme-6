import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function TagPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  const { posts } = await client.getPosts({ tags: [params.slug] });

  if (!posts || posts.length === 0) {
    // It would be better to have a way to check if the tag exists
    // but for now, we'll show not found if there are no posts.
    notFound();
  }

  // The tag name isn't available from the getPosts call directly.
  // We could fetch all tags and find the one with the matching slug,
  // or we can assume the first post's tag is representative.
  // For simplicity, we'll just use the slug for the title.
  const tagName = params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Tag: {tagName}</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
