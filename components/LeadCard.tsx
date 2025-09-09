import { Post, SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";
import { resizeImageUrl } from "@/lib/image";

interface CardProps {
  post: Post;
  config: SiteConfig;
}

const LeadCard = ({ post, config }: CardProps) => {
  let imageUrl = post.featuredImage;
  if (config.featureFlags.allowImageResize && imageUrl) {
    imageUrl = resizeImageUrl(imageUrl, { width: 1200, height: 900, fit: 'cover', format: 'webp' });
  }

  return (
    <article className="relative col-span-12 md:col-span-8 row-span-2">
      <Link href={`/${post.slug}`}>
        <div className="relative h-full">
          {imageUrl && (
            <Image
              src={imageUrl}
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
            <div className="text-sm mt-4 flex items-center gap-x-3 text-white/90">
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
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default LeadCard;
