import { getSSRBlazeBlogClient, Post } from "@/lib/blazeblog";
import { Metadata } from "next";
import Link from "next/link"; // Assuming we will link to author pages later
import { getCachedSiteConfig } from "@/lib/config";
import JsonLd from "@/components/JsonLd";

const AllAuthorsPage = async () => {
  const client = await getSSRBlazeBlogClient();
  const [postsResult, config] = await Promise.all([
    client.getPosts({ limit: 1000 }),
    getCachedSiteConfig(),
  ]);
  const { posts } = postsResult;

  const authors = posts.reduce((acc: { [key: number]: Post['user'] }, post) => {
    if (post.user && !acc[post.user.id]) {
      acc[post.user.id] = post.user;
    }
    return acc;
  }, {});

  const uniqueAuthors = Object.values(authors);

  return (
    <div className="container mx-auto px-4 py-8">
      {Array.isArray(postsResult.seo?.jsonLd) && postsResult.seo!.jsonLd.map((node: any, idx: number) => (
        <JsonLd key={idx} data={node} />
      ))}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Authors</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          Meet the talented authors who contribute to our blog.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {uniqueAuthors.map(author => (
          <div key={author.id} className="text-center">
            {/* Placeholder for author avatar */}
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                <span className="text-3xl">{author.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            {config?.featureFlags?.authorLink ? (
              <h2 className="font-bold">
                <Link href={`/author/${author.username}`} className="hover:underline">
                  {author.username}
                </Link>
              </h2>
            ) : (
              <h2 className="font-bold">{author.username}</h2>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAuthorsPage;

export async function generateMetadata(): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  try {
    const result = await client.getPosts({ limit: 1 });
    if (result?.seo?.meta) {
      return {
        title: result.seo.meta.title,
        description: result.seo.meta.description,
        alternates: { canonical: result.seo.meta.canonicalUrl },
      };
    }
  } catch {}
  return { title: 'Authors' };
}
