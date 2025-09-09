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
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-4 text-sm text-base-content/50">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            {config.featureFlags.enableAuthorsPage ? (
              <Link href={`/author/${post.user.username}`} className="hover:underline">
                {post.user.username}
              </Link>
            ) : (
              <span>{post.user.username}</span>
            )}
          </span>
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 6H4v12h16V8z"/></svg>
            {(() => {
              const ds = post.publishedAt || post.createdAt || post.updatedAt;
              const d = ds ? new Date(ds) : null;
              const ok = d && !isNaN(d.getTime());
              return <span>{ok ? d!.toLocaleDateString() : ''}</span>;
            })()}
          </span>
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 8a1 1 0 0 1 1 1v3.382l2.447 1.224a1 1 0 1 1-.894 1.788l-3-1.5A1 1 0 0 1 11 13V9a1 1 0 0 1 1-1z"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>
            <span>{post.readingTime || post.minsRead} min read</span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default LatestPostCard;
