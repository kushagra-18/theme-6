import { Post, SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";
import { resizeImageUrl } from "@/lib/image";

interface CardProps {
  post: Post;
  config: SiteConfig;
}

const LatestPostCard = ({ post, config }: CardProps) => {
  let imageUrl = post.featuredImage;
  if (config.featureFlags.allowImageResize && imageUrl) {
    imageUrl = resizeImageUrl(imageUrl, { width: 400, height: 400, fit: 'cover', format: 'webp' });
  }

  return (
    <article className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
      {imageUrl && (
        <Link href={`/${post.slug}`} className="md:col-span-1">
          <Image
            src={imageUrl}
            alt={post.title}
            width={400}
            height={400}
            className="object-cover w-full h-full aspect-square rounded-lg"
          />
        </Link>
      )}
      <div className={post.featuredImage ? "md:col-span-3" : "md:col-span-4"}>
        {post.tags && post.tags.length > 0 && (
          <Link href={`/tag/${post.tags[0].slug}`} className="text-sm font-semibold uppercase text-primary hover:underline">
            {post.tags[0].name}
          </Link>
        )}
        <h2 className="text-2xl font-bold mt-2">
          <Link href={`/${post.slug}`} className="hover:underline">{post.title}</Link>
        </h2>
        <p className="mt-3 text-base-content/70 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center mt-4 text-sm text-base-content/50">
          <span>By {post.user.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
};

export default LatestPostCard;
