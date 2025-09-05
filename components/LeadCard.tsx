import { Post } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";

interface CardProps {
  post: Post;
}

const LeadCard = ({ post }: CardProps) => {
  return (
    <article className="relative col-span-12 md:col-span-8 row-span-2">
      <Link href={`/${post.slug}`}>
        <div className="relative h-full">
          {post.featuredImage && (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover w-full h-full rounded-lg"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            {post.category && (
              <span className="text-sm font-semibold uppercase">{post.category.name}</span>
            )}
            <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">{post.title}</h2>
            <p className="mt-4 hidden md:block">{post.excerpt}</p>
            <div className="text-sm mt-4">
              <span>{post.user.username}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default LeadCard;
