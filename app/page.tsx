import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import PostCard from "@/components/PostCard";

export default async function HomePage() {
  const client = await getSSRBlazeBlogClient();
  const { posts } = await client.getPosts();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
