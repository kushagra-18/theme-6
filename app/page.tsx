import { getSSRBlazeBlogClient, Post } from "@/lib/blazeblog";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import Image from "next/image";

const MainFeaturedPost = ({ post }: { post: Post }) => (
  <div className="relative rounded-lg overflow-hidden mb-12">
    <Link href={`/${post.slug}`}>
      <Image
        src={post.featuredImage || "/placeholder.jpg"}
        alt={post.title}
        width={1200}
        height={600}
        className="object-cover w-full h-96"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8">
        <h2 className="text-4xl font-bold text-white">{post.title}</h2>
        <p className="text-white/80 mt-2">{post.excerpt}</p>
      </div>
    </Link>
  </div>
);


export default async function HomePage() {
  const client = await getSSRBlazeBlogClient();
  // Fetch more posts to have enough for the different sections
  const { posts } = await client.getPosts({ limit: 10 });

  const mainFeaturedPost = posts.length > 0 ? posts[0] : null;
  const featuredPosts = posts.length > 1 ? posts.slice(1, 5) : [];
  const latestPosts = posts.length > 5 ? posts.slice(5) : [];

  return (
    <div>
      {mainFeaturedPost && <MainFeaturedPost post={mainFeaturedPost} />}

      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {latestPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Latest</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
