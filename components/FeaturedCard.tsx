import { Post, SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";
import { resizeImageUrl } from "@/lib/image";

interface CardProps {
  post: Post;
  config: SiteConfig;
}

const FeaturedCard = ({ post, config }: CardProps) => {
  let imageUrl = post.featuredImage;
  if (config.featureFlags.allowImageResize && imageUrl) {
    imageUrl = resizeImageUrl(imageUrl, { width: 400, height: 300, fit: 'cover', format: 'webp' });
  }

  return (
    <article>
      {imageUrl && (
        <Link href={`/${post.slug}`}>
          <Image
            src={imageUrl}
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
          <span className="mx-2">•</span>
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 6H4v12h16V8z"/></svg>
            {(() => {
              const ds = post.publishedAt || post.createdAt || post.updatedAt;
              const d = ds ? new Date(ds) : null;
              const ok = d && !isNaN(d.getTime());
              return <span>{ok ? d!.toLocaleDateString() : ''}</span>;
            })()}
          </span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedCard;
