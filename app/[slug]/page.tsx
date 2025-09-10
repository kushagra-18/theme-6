import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { getCachedSiteConfig } from "@/lib/config";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedCard from "@/components/FeaturedCard"; // Re-using for "Read More"
import Script from "next/script";
import ViewsTracker from "@/components/ViewsTracker";
import JsonLd from "@/components/JsonLd";
import CommentSection from "@/components/CommentSection";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);
  if (!result) return { title: "Post not found" };
  return {
    title: result.seo.meta.title,
    description: result.seo.meta.description,
    alternates: { canonical: result.seo.meta.canonicalUrl },
  };
}

import { resizeImageUrl } from "@/lib/image";
import LeadFormModal from "@/components/LeadFormModel";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function PostPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();

  const [result, config] = await Promise.all([
    client.getPost(params.slug),
    getCachedSiteConfig()
  ]);

  if (!result || !config) {
    notFound();
  }

  const { data: post } = result;
  const relatedPosts = post.relatedPosts?.map(rp => rp.relatedPost).slice(0, 3) || [];
  const shareUrl = result?.seo?.meta?.canonicalUrl || `/${post.slug}`;

  let heroImageUrl = post.featuredImage;
  if (config.featureFlags.allowImageResize && heroImageUrl) {
    heroImageUrl = resizeImageUrl(heroImageUrl, { width: 1200, height: 600, fit: 'cover', format: 'webp' });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewsTracker />
      <article className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          {post.category && (
            config.featureFlags.enableCategoriesPage ? (
              <Link href={`/category/${post.category.slug}`} className="btn btn-sm btn-outline rounded-full mb-4">
                {post.category.name}
              </Link>
            ) : (
              <span className="badge badge-outline rounded-full mb-4 px-3 py-3">{post.category.name}</span>
            )
          )}

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

          <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap mt-6 text-sm text-base-content/70">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
              {config.featureFlags.authorLink ? (
                <Link href={`/author/${post.user.username}`} className="font-semibold hover:underline">
                  {post.user.username}
                </Link>
              ) : (
                <span className="font-semibold">{post.user.username}</span>
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
        </header>
        {/* Share Bar */}
        <div className="flex items-center justify-start md:justify-end gap-3 mt-2 text-sm text-base-content/60">
          <span>Share:</span>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="hover:text-base-content">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 3H21l-6.51 7.44L22.5 21h-6.637l-5.2-6.22L4.5 21H2l7-8.08L1.8 3h6.73l4.71 5.64L18.244 3Zm-1.164 16.5h1.786L7.006 4.39H5.13l11.95 15.11Z"/></svg>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="hover:text-base-content">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.478 17.523 2 11.93 2 6.338 2 1.86 6.478 1.86 12.07c0 4.997 3.657 9.14 8.438 9.93v-7.02H7.898v-2.91h2.4V9.845c0-2.369 1.413-3.68 3.572-3.68 1.034 0 2.115.185 2.115.185v2.329h-1.19c-1.175 0-1.54.73-1.54 1.48v1.78h2.62l-.419 2.91h-2.2v7.02C18.343 21.21 22 17.067 22 12.07Z"/></svg>
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="hover:text-base-content">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a2 2 0 1 0 0 4.001 2 2 0 0 0 0-4ZM12.28 8.5H8.99V20h3.29v-5.95c0-1.57.3-3.09 2.24-3.09 1.9 0 1.93 1.78 1.93 3.18V20h3.29v-6.78c0-3.34-.72-5.92-4.64-5.92-1.88 0-3.15 1.03-3.68 2.01h-.04V8.5Z"/></svg>
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-base-content">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.94 11.94 0 0 0 12.06.06C5.51.06.24 5.32.24 11.88c0 2.1.55 4.16 1.6 5.98L.02 24l6.29-1.77a12 12 0 0 0 5.75 1.47h.01c6.55 0 11.82-5.27 11.82-11.82 0-3.16-1.23-6.14-3.37-8.38h0Zm-8.46 18.3h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.73 1.05 1-3.63-.24-.37a9.87 9.87 0 0 1-1.51-5.27c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.12 1.03 6.99 2.9a9.8 9.8 0 0 1 2.89 6.98c0 5.44-4.43 9.86-9.88 9.86Zm5.45-7.39c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.94 1.16-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.77-1.68-2.06-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.51-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.42 0 1.43 1.05 2.81 1.2 3 .15.19 2.07 3.16 5.03 4.43.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.18-1.41-.08-.12-.3-.19-.6-.34Z"/></svg>
          </a>
        </div>

        {heroImageUrl && (
          <figure className="my-8">
            <Image
              src={heroImageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className="object-cover w-full rounded-lg"
            />
            {/* Optional photo credit line can be added here if available in API */}
          </figure>
        )}

        {/* Content Body */}
        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Tags Row (cool compact chips) */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-sm uppercase tracking-wide text-base-content/60 mr-2 inline-flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.41 11.58 12.42 2.59A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l8.99 8.99a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0 0-2.82ZM6.5 9A1.5 1.5 0 1 1 8 7.5 1.5 1.5 0 0 1 6.5 9Z"/></svg>
              Tags
            </span>
            {post.tags.map(tag => (
              config.featureFlags.enableTagsPage ? (
                <Link key={tag.id} href={`/tag/${tag.slug}`} className="badge badge-outline hover:bg-base-200 hover:border-base-300">
                  {tag.name}
                </Link>
              ) : (
                <span key={tag.id} className="badge badge-outline">{tag.name}</span>
              )
            ))}
          </div>
        )}
      </article>

      {/* "Read More" Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-base-300">
          <h2 className="text-3xl font-bold text-center mb-8">Read More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {relatedPosts.map((relatedPost) => (
              <FeaturedCard key={relatedPost.id} post={relatedPost} config={config} />
            ))}
          </div>
        </section>
      )}
      {config.featureFlags.enableComments && (
        <div className="max-w-3xl mx-auto">
          <CommentSection postId={post.id} postSlug={post.slug} />
        </div>
      )}
      {config.featureFlags.enableNewsletters && (
        <div className="mt-8">
          <NewsletterSignup compact />
        </div>
      )}
      {/* JSON-LD structured data from API */}
      {Array.isArray(result.seo?.jsonLd) && result.seo.jsonLd.map((node: any, idx: number) => (
        <JsonLd key={idx} data={node} />
      ))}
      <Script id="blazeblog-view-cdn" src="https://cdn.jsdelivr.net/gh/blazeblog/view-script@main/view.js" strategy="afterInteractive" />
      <LeadFormModal/>
    </div>
  );
}
