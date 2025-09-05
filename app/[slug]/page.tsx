import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);

  if (!result) {
    return {
      title: "Post not found",
    };
  }

  const { data: post, seo } = result;

  return {
    title: seo.meta.title,
    description: seo.meta.description,
    alternates: {
      canonical: seo.meta.canonicalUrl,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);

  if (!result) {
    notFound();
  }

  const { data: post } = result;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose lg:prose-xl max-w-none">
        <header className="mb-12">
          <h1 className="!mb-4 text-4xl md:text-6xl font-bold">{post.title}</h1>
          <div className="flex items-center text-base text-base-content/70">
            <span>By {post.user.username}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {post.featuredImage && (
          <figure className="mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={600}
              className="object-cover w-full rounded-lg"
            />
          </figure>
        )}

        <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </article>
    </div>
  );
}
