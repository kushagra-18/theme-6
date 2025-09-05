import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  const { posts, category } = await client.getPosts({ category: params.slug });

  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryName = category?.name || params.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Category: {categoryName}</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
