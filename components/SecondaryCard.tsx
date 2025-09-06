import { Post, SiteConfig } from "@/lib/blazeblog";
import Link from "next/link";
import Image from "next/image";
import { resizeImageUrl } from "@/lib/image";

interface CardProps {
  post: Post;
  config: SiteConfig;
}

const SecondaryCard = ({ post, config }: CardProps) => {
  let imageUrl = post.featuredImage;
  if (config.featureFlags.allowImageResize && imageUrl) {
    imageUrl = resizeImageUrl(imageUrl, { width: 600, height: 600, fit: 'cover', format: 'webp' });
  }

  return (
    <article className="relative col-span-12 md:col-span-4">
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
          <div className="absolute bottom-0 left-0 p-6 text-white">
            {post.category && (
              <span className="text-xs font-semibold uppercase">{post.category.name}</span>
            )}
            <h2 className="text-xl font-bold mt-1 leading-tight">{post.title}</h2>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default SecondaryCard;
