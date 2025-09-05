import { Post } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";

interface CardProps {
  post: Post;
}

const FeaturedCard = ({ post }: CardProps) => {
  return (
    <article>
      {post.featuredImage && (
        <Link href={`/${post.slug}`}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={400}
            height={300}
            className="object-cover w-full h-48 rounded-lg"
          />
        </Link>
      )}
      <div className="mt-4">
        <h3 className="text-xl font-bold leading-tight">
          <Link href={`/${post.slug}`} className="hover:underline">{post.title}</Link>
        </h3>
        <p className="mt-2 text-sm text-base-content/70">{post.excerpt}</p>
        <div className="flex items-center mt-3 text-xs text-base-content/50">
          <span>{post.user.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedCard;
