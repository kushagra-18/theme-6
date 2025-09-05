import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedCard from "@/components/FeaturedCard"; // Re-using for "Read More"

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

export default async function PostPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);

  if (!result) {
    notFound();
  }

  const { data: post } = result;
  const relatedPosts = post.relatedPosts?.map(rp => rp.relatedPost).slice(0, 3) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          {/* Tag Chip */}
          {post.tags && post.tags.length > 0 && (
            <Link href={`/tag/${post.tags[0].slug}`} className="btn btn-sm btn-outline rounded-full mb-4">
              {post.tags[0].name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">{post.title}</h1>

          {/* Byline */}
          <div className="flex items-center justify-center mt-6 text-sm text-base-content/70">
            <div className="flex items-center">
              {/* Assuming no author avatar for now, can be added if available in API */}
              <span className="font-semibold">{post.user.username}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {/* Hero Image */}
        {post.featuredImage && (
          <figure className="my-8">
            <Image
              src={post.featuredImage}
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
      </article>

      {/* "Read More" Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-base-300">
          <h2 className="text-3xl font-bold text-center mb-8">Read More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {relatedPosts.map((relatedPost) => (
              <FeaturedCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
