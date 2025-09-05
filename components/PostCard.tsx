import { Post } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <article>
      {post.featuredImage && (
        <Link href={`/${post.slug}`} className="block overflow-hidden rounded-lg group">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={800}
            height={400}
            className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </Link>
      )}
      <div className="mt-4">
        {post.category && (
          <Link href={`/category/${post.category.slug}`} className="text-sm font-semibold uppercase text-primary">
            {post.category.name}
          </Link>
        )}
        <h2 className="mt-2 text-2xl font-bold leading-tight">
          <Link href={`/${post.slug}`} className="hover:underline">{post.title}</Link>
        </h2>
        <p className="mt-2 text-base-content/70">{post.excerpt}</p>
        <div className="flex items-center mt-4 text-sm text-base-content/50">
          <span>By {post.user.username}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
