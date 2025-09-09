import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { getCachedSiteConfig } from "@/lib/config";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FeaturedCard from "@/components/FeaturedCard";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: { slug: string };
  searchParams?: { page?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  try {
    const { seo } = await client.getPostsByAuthor(params.slug, { page: 1, limit: 9 });
    if (seo?.meta) {
      return {
        title: seo.meta.title,
        description: seo.meta.description,
        alternates: { canonical: seo.meta.canonicalUrl },
      };
    }
  } catch {}
  return {
    title: `Posts by ${params.slug}`,
    description: `Read posts written by ${params.slug}`,
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const client = await getSSRBlazeBlogClient();
  const config = await getCachedSiteConfig();

  const page = Number(searchParams?.page || 1) || 1;
  const limit = 9;

  const { posts, pagination, author, seo } = await client.getPostsByAuthor(params.slug, { page, limit });

  const authorName = author?.username || params.slug;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data if provided by API */}
      {Array.isArray(seo?.jsonLd) && seo!.jsonLd.map((node: any, idx: number) => (
        <JsonLd key={idx} data={node} />
      ))}
      {!config && (
        <p className="text-center text-error mb-6">Could not load site configuration.</p>
      )}
      <header className="text-center mb-10">
        <div className="avatar placeholder mx-auto mb-4">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
            <span className="text-3xl">{authorName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold">{authorName}</h1>
        {author?.bio && (
          <p className="mt-3 max-w-2xl mx-auto text-base-content/70">{author.bio}</p>
        )}
      </header>

      <section>
        {posts.length === 0 ? (
          <p className="text-center">No posts found for this author.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              config ? (
                <FeaturedCard key={post.id} post={post} config={config} />
              ) : (
                <div key={post.id} className="p-4 border rounded">
                  <Link href={`/${post.slug}`} className="font-semibold hover:underline">{post.title}</Link>
                  <p className="opacity-70 text-sm mt-2">{post.excerpt}</p>
                </div>
              )
            ))}
          </div>
        )}
      </section>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          {pagination.prevPage && (
            <Link className="btn btn-outline" href={`/author/${params.slug}?page=${pagination.prevPage}`}>
              Previous
            </Link>
          )}
          <span className="text-sm opacity-70">Page {pagination.page} of {pagination.totalPages}</span>
          {pagination.nextPage && (
            <Link className="btn btn-outline" href={`/author/${params.slug}?page=${pagination.nextPage}`}>
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
